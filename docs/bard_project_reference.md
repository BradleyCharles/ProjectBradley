# BARD: Project Reference

## 1. Summary

**BARD (Batched Asynchronous Response Delivery: A Pre-Rendered LLM Architecture for Stateful NPC Dialogue)** is a 2D top-down action RPG built in Godot 4 with GDScript, modelled on the feel of *The Legend of Zelda: A Link to the Past*. Its core is a local Python pipeline that reads the game's state at each in-game day boundary and uses a locally hosted LLM to write fresh dialogue for every named NPC. The game was developed under the working title Erimentha, but BARD is the project's name.

The central claim of the project: NPCs can react to what the player actually did, and the game can still be fully deterministic and offline at runtime, because the LLM runs between play sessions rather than during them.

This was a solo capstone project for the BASc Application Development program at North Seattle College. I owned design, game code, the AI pipeline, tooling, documentation and the capstone poster.

## 2. The Problem and the Thesis

Most attempts at LLM-driven NPCs call a model live during gameplay. That brings a predictable set of problems:

- **Latency.** Dialogue stalls while the model generates.
- **Hallucination.** The NPC can invent quests, items or lore that do not exist in the game.
- **Cost and connectivity.** Cloud APIs need a network connection and money per call.
- **Untestable behaviour.** Output at the moment of play is unreviewed and unrepeatable.

BARD's answer is to **move generation out of the real-time loop**. The game writes down what happened. When the day ends, a batch job turns that record into a complete dialogue tree for every NPC, validates it, and writes it to disk. During play, the game only reads JSON files. The LLM is a content generator, never a runtime dependency.

## 3. Design Philosophy

**Hard boundary between simulation and language.** Godot owns numbers, flags and rules. Python owns prose. Godot writes immutable raw state to `game_state.json`; the pipeline converts it into natural language, calls the model, and writes dialogue files back. The LLM never touches game logic, and gameplay never waits on it.

**The model should never see raw numbers.** The `nl_descriptors.py` module is built on one stated rule: raw numbers and booleans do not reach the LLM directly. Kill counts become tiered phrases ("a handful", "a great many"), each with several equivalent wordings chosen at random so NPCs do not repeat themselves day to day. Bounty quantities are deliberately hidden from the prompt. This keeps the model from fixating on or misquoting figures.

**Label how much the model should trust each piece of context.** Prompt context is grouped by epistemic status:

- Verified facts, treated as ground truth
- The NPC's own recollections, flagged as subjective and possibly incomplete
- Background facts, flagged as possibly outdated
- Rumours, flagged as something the NPC does not know to be true

A fact's weight (core, recent, stale) is resolved at read time based on its age, rather than stored and mutated.

**Gameplay-critical functions never depend on generated text.** Every named NPC has a hardcoded root menu: the innkeeper's sleep and shop options, the blacksmith's wares and upgrades, the guild commander's bounty board and turn-in. The LLM only supplies the greeting and conversational branches, and these are merged under the hardcoded nodes (hardcoded keys win on collision). If generation fails completely, the NPC still works as a shopkeeper or quest giver.

**Fail soft, in layers.** Every stage has a fallback so a bad model run degrades the experience rather than breaking it (detailed in section 6.5).

**Offline and swappable.** Everything runs locally on consumer hardware through Ollama. The model and endpoint are environment-configurable, so the pipeline can be pointed at a lighter model for weaker machines without code changes.

**Scope discipline.** The evaluation centrepiece is the pipeline architecture, so the game was kept intentionally simple where polish would not add to that thesis. Progression is equipment-based with no levelling or stat trees, and GDScript was chosen over C# because the performance bottleneck is LLM inference, not the game runtime.

## 4. System Architecture

```
Godot (game runtime)                     Python pipeline (offline batch)
-------------------                      -------------------------------
Player plays a day
Kills, bounties, flags tracked
Player sleeps at the inn
  -> end_day() snapshots + advances
  -> writes game_state.json  ------------> reads game_state.json
  -> launches Python subprocess            + world_registry, world_lore,
  -> shows loading overlay                   NPC variant files, rumours
  -> polls flag files every 3 s            for each NPC:
                                             build prompt (NL descriptors)
                                             call local LLM via Ollama
                                             validate / repair / fall back
                                             write dialogue/{npc}_day{N}.json
                                             generate one-line recollection
                                           write ambient villager exchanges
  <-- pipeline_ready.flag  -----------------write flag
  -> reloads every NPC's dialogue
  -> transitions back to town
```

**Key points of the handshake:**

- Communication is file based: JSON in, JSON out, plus sentinel flag files (`ready`, `failed`, `crashed`, `connected`). Godot never blocks.
- A progress file lets Godot draw a progress bar while the pipeline works through each NPC.
- `game_state.json` is written before the pipeline launches, so the pipeline always sees a completed day.
- A watchdog treats a pipeline that never connects as crashed and shows an error overlay.

## 5. Technology Stack

| Layer | Technology |
|---|---|
| Game engine | Godot 4 (4.6-stable), GDScript |
| LLM runtime | Ollama, local GPU inference |
| Model | Gemma 4 E4B (Q4 quantization), configurable via env var; replaced an earlier Qwen3 8B |
| Pipeline | Python 3, standard library plus `requests` |
| Data interchange | JSON (state, dialogue, registry, lore, archetypes, saves) |
| Art tooling | Aseprite via the AsepriteWizard Godot plugin |
| Fonts | Almendra and Almendra SC for a parchment feel |
| Version control | Git and GitHub |
| Development environment | Nobara Linux (Wayland), VS Code, Claude Code for implementation |
| Hardware | NVIDIA RTX 4060 class GPU (8 GB VRAM) running the model locally |

## 6. The BARD Pipeline in Depth

### 6.1 World generation (one-time setup)

`world_gen.py` creates a new game:

1. Gets the player name (typed, or LLM-generated).
2. Generates world lore, with a hand-written fallback.
3. For each NPC archetype (innkeeper, blacksmith, guild commander), generates a named variant from the role template and shared generation rules.
4. Assigns variants to the town and writes `world_registry.json`.
5. Generates villager names for ambient NPCs.
6. Writes the initial game state.
7. Runs the end-of-day pipeline once so Day 1 dialogue exists before the first play session.

A name-usage tracker retires first names after repeated use, so separate generations do not keep producing the same cast.

### 6.2 The end-of-day run

`end_of_day.py` loops over each named NPC. For each:

1. Load the variant (personality and system-prompt fragment).
2. Build a system prompt and a user prompt.
3. Call the model and request JSON.
4. Validate against the dialogue schema.
5. If invalid, make a second "repair" call; if still invalid, fall back.
6. Post-process: inject metadata and the `end_day` action on sleep responses.
7. Write the dialogue file.
8. Make a small second call asking for a single subjective sentence from the NPC's point of view (the recollection), and store it as a memory.

After the NPC loop it generates a pool of short two-line exchanges for wandering villagers, then raises the success or partial-failure flag.

### 6.3 Prompt construction

**System prompt:** NPC identity, role and town, the variant's personality fragment, the canonical lore text, and in-character, JSON-only instructions.

**User prompt sections:** the day, world and town lore, a field report built from NL descriptors, bounty status, what the NPC knows about this hunter, circulating rumours, a role-specific block (guild records for the commander, inn context for the innkeeper), a schema example, and dialogue rules (node count limits, required greeting and farewell, no edges back to the greeting).

### 6.4 NPC consistency and memory

- Per-NPC system prompts from generated variants.
- Shared generation rules across roles.
- A fixed canonical lore file injected into every prompt.
- Cross-role name de-duplication.
- A persistent `npc_facts` store with subjective recollections written by the NPC itself.
- Weekly chronicle and rumour generation, so NPCs can hear about the player's deeds secondhand.

### 6.5 Validation and failure handling

**Schema validation** checks that the nodes exist, greeting and farewell are present, every response target exists, farewell responses terminate, and every node can reach an exit (cycle detection).

**Fallback chain:**

| Failure | Response |
|---|---|
| Ollama not running | Connectivity check, then attempt to auto-start it |
| Network error | 3 attempts with a delay |
| Unparseable JSON | Re-request the call |
| Fails schema validation | One LLM repair call, then re-validate |
| Repair fails | Reuse the most recent previous day's dialogue |
| Missing variant, lore or names | Hand-written fallback files or hardcoded defaults |
| Exception on one NPC | Skip that NPC, mark the run partial |
| Unhandled exception | Traceback written to a crash flag, error overlay in Godot |

### 6.6 Chronicle and rumours

`chronicle.py` (triggered with Ctrl+R in town) summarizes the week, generates a narrative record and key player deeds, then turns each deed into a rumour. Most rumours name the player; some are anonymous but traceable. Rumours are capped, aged out by a time-to-live, and injected into later end-of-day prompts as "things you have heard but cannot confirm".

## 7. Game Systems

**SceneManager autoload.** The global singleton for state, scene transitions, save/load, the end-of-day sequence, the pipeline launcher and the loading overlays. All scene changes route through one transition function with a re-entry guard.

**Save/load.** Godot-owned state (inventory, upgrades, bounties, flags, kill history) goes into JSON save slots. Pipeline-owned memory (`npc_facts`) lives only in `game_state.json`, which keeps ownership of each data set unambiguous.

**Bounty loop.** The core progression loop. Bounties posted on the Monster Hunters Guild board spawn mobs in zones of the field, with a cap per zone. Kills update bounty progress, completed bounties are turned in to the guild commander for Scripts, and uncompleted ones expire at day end. Targets are zone-based, and quantities are hidden from the player.

**Combat and weapons.** A sword and an axe with different damage, knockback and swing speed, defined in data files. Player invincibility frames, knockback and a roll. Upgrades cost Scripts and Slime Goop.

**Enemies and bosses.** A shared base class defines health, damage, signals and separation behaviour. Subclasses implement distinct personalities:

- Slime 1: pack mentality. Flees alone, chases when others are nearby, and spreads aggro through the group.
- Slime 2: passive until hit, then alerts nearby slimes.
- Slime 3: solo aggressor.
- Orcs, plants and vampires with their own behaviours across three tiers each.
- Bosses spawn when kill thresholds are met, with a telegraphed area attack (expanding red circle), a cooldown, and a boss health bar.

**NPCs.** One base script handles proximity detection, dialogue merging, dynamic menu patching (the blacksmith menu changes with owned weapons, the commander's menu changes when a bounty is complete), and wandering villagers who chat with each other using generated ambient lines.

**UI.** HUD, bounty tracker, pause menu, minimap, dialogue box with typewriter effect, game-over screen and themes. Most of it is built in code rather than by hand in the editor.

## 8. Engineering Decisions and Debugging Stories

These are useful concrete examples of problem solving.

**Collision model for non-pushing solid bodies.** Mobs initially pushed the player. The fix was architectural: put all mobs and blocking NPCs on a dedicated layer, give mobs a collision mask of 0 so they apply no physics forces, remove that layer from the player's mask so Godot's recovery step stops shoving the player, and implement blocking in script by cancelling velocity components that point into a nearby mob. Documented in `game_mechanics.md` including the anti-patterns.

**Invisible knockback.** Knockback impulses appeared to do nothing because the chase AI reassigned velocity on the very next physics tick. The fix was a hurt-state early return in the AI loop.

**Global state bug in contact logic.** An early version stopped a mob when the player was invincible, but invincibility is global, so one mob landing a hit froze every mob. The fix was to base contact stopping on per-mob distance only.

**Mobs that could never deal damage.** Separation code in `_integrate_forces` kept a mob outside the range where the hurt area would trigger. Removing it restored contact damage.

**Wandering NPCs and static bodies.** A moving `StaticBody2D` reports an apparent velocity to the physics server and pushes characters it overlaps. The solution was to give only stationary named NPCs a physics body, and let wanderers be pass-through.

**Contact radius derived, not hard-coded.** Body radius is computed from the collision shape and scale, so changing a sprite's scale automatically updates blocking and contact distances.

**Quality-of-life documentation.** The mechanics and systems docs were kept as live documents describing how each system currently works, so none had to be reverse-engineered a second time.

## 9. Development Process

- **Design-first workflow.** Planning and design discussions happened in Claude chat; implementation ran through Claude Code in VS Code; Godot editor steps were done by hand. Large changes were broken into ordered, phased prompts (the mob expansion was an 8-phase roadmap).
- **Structure first, tuning later.** The structural approach was locked before parameters were tweaked.
- **Iterative pipeline testing.** Run the pipeline directly from a terminal, watch GPU residency with `ollama ps`, capture logs with `tee`, and inspect generated files.
- **Documentation as a deliverable.** Project map, mechanics, systems, mob roadmap, user manual and a capstone poster.

## 10. Honest Assessment: Known Limitations

Knowing these in advance lets you discuss the project credibly rather than defensively.

**Working end to end:** nightly dialogue generation for the three named NPCs with validation, repair and fallback; recollection memory; ambient villager exchanges; world generation; the Ollama auto-start and flag handshake with progress bar; the combat, bounty, weapon-upgrade, save and minimap systems.

**Known defects and gaps in the pipeline:**

- The "has met this hunter" flag does not match between Godot (full NPC id) and Python (first word of the id), so NPCs always behave as if meeting the player for the first time. A small, real integration bug.
- Kill history and the chronicle week summary only reflect one slime type, even though other enemies exist.
- Game-sourced "verified" facts and the "core" weight are designed but nothing writes them yet.
- Facts are deduplicated by exact text only and never pruned, so re-running a day accumulates recollections.
- The chronicle and rumour system is implemented but has not been exercised in a real run.
- No per-call timeout on the HTTP request, so a hung model call blocks indefinitely, despite a comment claiming otherwise.
- The repair call receives a Python `repr` of the broken result rather than JSON.
- If Day 1 generation fails for an NPC, there is no previous file to fall back to, so that NPC only has its hardcoded menu. This happened once during testing.
- The dedicated dialogue fallback described in the docs is not wired in; fallbacks are used for variants and lore, not for dialogue.
- The ambient exchange prompt uses raw counts, which breaks the "no raw numbers" rule.
- There is no automated test suite or CI, and Python logging goes to stdout only, so nothing persists on disk apart from flags and the crash traceback.

**Other incomplete areas:** building interiors are empty placeholder scenes, the innkeeper's shop branch is a stub, a second town exists in the registry but is not used, and some documentation has drifted from the code (variant counts, enemy counts, trigger conditions).

## 11. Future Work

- Fix the meeting-flag mismatch and broaden kill history to all enemy types.
- Add game-sourced verified facts and promotion of important recollections to core status.
- Prune and consolidate NPC memory.
- Add request timeouts and persistent pipeline logging.
- Use the fallback dialogue files in the final fallback step.
- Add tests, starting with the pure functions in `nl_descriptors.py` and the dialogue validator.
- Retrieval-augmented lore using embeddings for larger lore sets.
- Multiple towns using the existing registry structure.
- Blacksmith crafting with LLM-generated flavour names for monster drops.
- Combat feel polish: screen shake, damage numbers, hit flash, slash trail, death particles.

## 12. Interview Talking Points

**Why not call the LLM at runtime?** Latency, hallucination risk, and the need for a reliable demo. Pre-rendering makes the output reviewable and the game deterministic.

**How do you stop the model inventing things?** Constrain what it sees (natural-language descriptors, labelled trust levels), constrain what it outputs (JSON schema, validation, repair), and keep gameplay-critical options hardcoded so a bad generation cannot break the game.

**What would you do differently?** Add a test suite earlier, make the Godot and Python sides share a single source of truth for flag naming (the meeting-flag bug is exactly the kind of contract drift that creates), and add structured logging from day one.

**What was the hardest bug?** The collision and knockback interaction. It required understanding how Godot's `CharacterBody2D` recovery behaves versus `RigidBody2D` forces, then redesigning layers and masks rather than patching symptoms.

**How did you use AI tools?** As a design partner and implementation accelerator within a structured workflow, with me owning architecture, review, debugging and verification. The audit of the finished repo turned up real defects, which is a reason to treat AI-assisted code as something you test and read, not trust.

## 13. Resume and Website Copy (No Metrics)

**Resume bullets**

- Designed and built BARD, a pre-rendered LLM architecture that generates stateful NPC dialogue from game-state data in an offline batch pipeline, eliminating runtime latency and hallucination risk in a Godot 4 action RPG.
- Engineered a Python pipeline against a locally hosted LLM (Ollama, Gemma 4) with schema validation, cycle detection, automated repair calls and layered fallbacks so a failed generation degrades gracefully instead of breaking gameplay.
- Built a prompt-construction layer that converts raw game telemetry into tiered natural language and labels context by trust level (verified, subjective, outdated, rumour) to reduce model fabrication.
- Implemented a file-based, non-blocking integration between Godot and Python using flag files, progress polling and a watchdog, with auto-start of the model server.
- Developed the full game on the Godot side: scene management, save/load, bounty and progression systems, combat, varied enemy AI, telegraphed boss mechanics and a code-built UI.
- Diagnosed and resolved physics and AI issues (collision layers, knockback overridden by AI, global state in contact logic) and documented the resulting mechanics as living reference material.

**Short website blurb**

> BARD is a 2D action RPG whose NPCs remember what you did. Its pre-rendered LLM pipeline reads each day's game state, translates it into natural language, and uses a locally hosted LLM to write new dialogue trees for every character overnight, all before you next speak to them. Because generation happens between sessions, the game stays fast, offline and deterministic while still feeling alive.
