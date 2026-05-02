"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import styles from "../../styles/cp2077.module.css";

/* ── Body class ─────────────────────────────────────────── */
function useCp2077BodyClass() {
  useEffect(() => {
    document.body.classList.add("cp2077-page");
    return () => document.body.classList.remove("cp2077-page");
  }, []);
}

/* ── Types ──────────────────────────────────────────────── */
type Badge = "miss" | "care" | "safe" | "lock" | "post" | "excl";
type CollectionFilter = "all" | "collected" | "notcollected";
type BadgeFilter = Badge | null;
type SectionFilter =
  | "base-main" | "base-side"
  | "dlc-main"  | "dlc-side"
  | "world" | "craft" | "vendor"
  | null;
type WeaponTypeFilter =
  | "pistol" | "revolver" | "shotgun" | "smg"
  | "assault-rifle" | "precision-rifle" | "sniper-rifle" | "lmg"
  | "one-handed-club" | "two-handed-club" | "knife" | "katana" | "hammer" | "axe"
  | "other"
  | null;
type WeaponSubTypeFilter = "power" | "tech" | "smart" | "throwable" | "melee" | null;

interface WeaponItem {
  id: string;
  name: string;
  type: string;
  badge: Badge;
  questLabel: string;
  questName?: string;
  details: string;
  note?: string;
  nearby?: string;
  tags: string[];
}

interface Subsection {
  label: string;
  items: WeaponItem[];
}

interface SectionData {
  id: string;
  title: string;
  lineColor: string;
  icon: string;
  subsections: Subsection[];
}

/* ── Data ───────────────────────────────────────────────── */
const SECTIONS: SectionData[] = [
  {
    id: "base-main",
    title: "Base Game — Main Story",
    lineColor: "#f5d300",
    icon: "◈",
    subsections: [
      {
        label: "── ACT 1 ────────────────────────────────────",
        items: [
          {
            id: "chaos",
            name: "Chaos",
            type: "TECH PISTOL",
            badge: "care",
            questLabel: "Quest:",
            questName: "The Pickup",
            details:
              "Loot from Royce during/after boss fight. Only drops if you fight and kill him. Paying peacefully locks you out.",
            nearby:
              "Nearby: nothing missable, but Doom Doom requires Dum Dum to survive this quest — spare him if you want that too.",
            tags: ["base", "main"],
          },
          {
            id: "kongou",
            name: "Kongou",
            type: "POWER PISTOL",
            badge: "miss",
            questLabel: "Quest:",
            questName: "The Heist",
            details:
              "Yorinobu's nightstand in the penthouse. Grab it during the free-roam window before the story triggers. Area is permanently locked after.",
            nearby:
              "Nearby: Satori is also in this mission — don't leave the roof without it.",
            tags: ["base", "main"],
          },
          {
            id: "satori",
            name: "Satori",
            type: "KATANA",
            badge: "miss",
            questLabel: "Quest:",
            questName: "The Heist",
            details:
              "Inside the AV on the rooftop landing pad after T-Bug opens the door. One-time access.",
            nearby: "Nearby: Kongou is downstairs on Yorinobu's nightstand.",
            tags: ["base", "main"],
          },
        ],
      },
      {
        label: "── ACT 2 (EARLY) ────────────────────────────",
        items: [
          {
            id: "plan-b",
            name: "Plan B",
            type: "POWER PISTOL",
            badge: "safe",
            questLabel: "Quest:",
            questName: "Playing for Time / Side Job: Kold Mirage",
            details:
              "On Dex's body in Eastern Wastelands. You pass by this area during Playing for Time. Can revisit anytime later.",
            tags: ["base", "main"],
          },
          {
            id: "lizzie",
            name: "Lizzie",
            type: "TECH PISTOL",
            badge: "safe",
            questLabel: "Quest:",
            questName: "Automatic Love",
            details:
              "In Lizzie's Bar basement just before Judy's office. Lizzie's Bar stays accessible after the quest.",
            nearby:
              "Nearby: Cocktail Stick is in Clouds during this same quest — do NOT miss it.",
            tags: ["base", "main"],
          },
          {
            id: "cocktail-stick",
            name: "Cocktail Stick",
            type: "KATANA",
            badge: "miss",
            questLabel: "Quest:",
            questName: "Automatic Love",
            details:
              "Inside Clouds, in the makeup room adjacent to the dark room overlooking the VIP lounge (near Evelyn's jacket). Area locked after quest.",
            nearby:
              "Nearby: Lizzie is in the same mission downstairs at Lizzie's Bar.",
            tags: ["base", "main"],
          },
          {
            id: "cottonmouth",
            name: "Cottonmouth",
            type: "ONE-HANDED CLUB",
            badge: "miss",
            questLabel: "Quest:",
            questName: "The Space In Between",
            details:
              "In Fingers' bedroom when you enter to interrogate him. Grab it before leaving.",
            tags: ["base", "main"],
          },
        ],
      },
      {
        label: "── ACT 2 (MID) ──────────────────────────────",
        items: [
          {
            id: "shingen",
            name: "Prototype Shingen Mark V",
            type: "SMART SMG",
            badge: "safe",
            questLabel: "Quest:",
            questName: "Gimme Danger",
            details:
              "Arasaka Industrial Park, Arroyo. Shipping container on a trailer outside the warehouse, marked 667. Booby-trapped with claymores. Can return after mission.",
            tags: ["base", "main"],
          },
          {
            id: "genjiroh",
            name: "Genjiroh",
            type: "SMART PISTOL",
            badge: "safe",
            questLabel: "Quest:",
            questName: "Play It Safe",
            details:
              "Behind a locked Technical Ability door on floor 21 while dealing with the snipers. Door code 2906 or high Tech stat. Door remains accessible after mission.",
            tags: ["base", "main"],
          },
          {
            id: "sasquatch-hammer",
            name: "Sasquatch's Hammer",
            type: "HAMMER",
            badge: "miss",
            questLabel: "Quest:",
            questName: "I Walk the Line",
            details:
              "Loot from Sasquatch after the boss fight inside Totentanz. You cannot re-enter after the quest ends.",
            tags: ["base", "main"],
          },
        ],
      },
      {
        label: "── ENDGAME / POINT OF NO RETURN ─────────────",
        items: [
          {
            id: "caretakers-spade",
            name: "Caretaker's Spade",
            type: "HAMMER",
            badge: "care",
            questLabel: "Quest:",
            questName: "Knockin' on Heaven's Door",
            details:
              "Near a conference table, leaning against a tree. Available during the Rogue/Aldecaldos ending path. You keep it when you reload post-credits.",
            nearby: "Nearby: Pride is also in this mission (Rogue path only).",
            tags: ["base", "main"],
          },
          {
            id: "pride",
            name: "Pride",
            type: "POWER PISTOL",
            badge: "lock",
            questLabel: "Quest:",
            questName: "Knockin' on Heaven's Door",
            details:
              "Rogue's pistol. Only available on The Sun ending (let Johnny take over, assault Arasaka with Rogue). Pick up from the ground after Rogue dies. You keep it on credits reload.",
            nearby:
              "Nearby: Caretaker's Spade and Prejudice are also in this ending path.",
            tags: ["base", "main", "endgame"],
          },
          {
            id: "prejudice",
            name: "Prejudice",
            type: "POWER ASSAULT RIFLE",
            badge: "lock",
            questLabel: "Quest:",
            questName: "Nocturne Op55N1 (The Sun path)",
            details:
              "Found at the Afterlife when preparing for the Arasaka raid. Same ending path as Pride. Kept on credits reload.",
            tags: ["base", "main", "endgame"],
          },
          {
            id: "amnesty",
            name: "Amnesty",
            type: "POWER REVOLVER",
            badge: "lock",
            questLabel: "Quest:",
            questName: "We Gotta Live Together",
            details:
              "Exclusive to the Aldecaldos ending path. Find Cassidy in the southeast of the nomad camp and win his bottle-shooting challenge.",
            tags: ["base", "main", "endgame"],
          },
          {
            id: "byakko",
            name: "Byakko",
            type: "KATANA",
            badge: "lock",
            questLabel: "Quest:",
            questName: "Search and Destroy / Secure Your Soul (Arasaka/Hanako ending)",
            details:
              "Adam Smasher's iconic katana. Only available on the Arasaka ending path. Loot it from his body.",
            tags: ["base", "main", "endgame"],
          },
          {
            id: "ba-xing-chong",
            name: "Ba Xing Chong",
            type: "SMART SHOTGUN (crafting spec)",
            badge: "post",
            questLabel: "Location:",
            questName: "Ebunike freighter",
            details:
              "After defeating Adam Smasher and getting his access token (post-credits). Crafting spec in a locked room behind his desk. Must reload save after credits.",
            tags: ["base", "main", "postGame"],
          },
        ],
      },
    ],
  },
  {
    id: "dlc-main",
    title: "Phantom Liberty — Main Story",
    lineColor: "#00c8ff",
    icon: "◈",
    subsections: [
      {
        label: "── DOGTOWN STORY (IN ORDER) ──────────────────",
        items: [
          {
            id: "myers-weapon",
            name: "Myers' Weapon",
            type: "POWER PISTOL",
            badge: "safe",
            questLabel: "Quest:",
            questName: "Lucretia My Reflection",
            details:
              "The weapon Myers is carrying when you meet her. It's left leaning against the stash box after she and Reed exit the hideout. Don't leave without checking the room.",
            tags: ["dlc", "main"],
          },
          {
            id: "mantis",
            name: "Mantis",
            type: "POWER ASSAULT RIFLE",
            badge: "miss",
            questLabel: "Quest:",
            questName: "Birds With Broken Wings",
            details:
              "In The Moth nightclub armory, in a display case on the left side. Grab it while you're in the building.",
            nearby:
              "Nearby: Her Majesty is given to you by Alex during Get It Together, the follow-up mission.",
            tags: ["dlc", "main"],
          },
          {
            id: "her-majesty",
            name: "Her Majesty",
            type: "POWER PISTOL (silenced)",
            badge: "safe",
            questLabel: "Quest:",
            questName: "Get It Together",
            details:
              "Alex gives you this silenced pistol at the safehouse before the Black Diamond mission. Quest reward, can't miss it.",
            tags: ["dlc", "main"],
          },
          {
            id: "rasetsu",
            name: "Rasetsu",
            type: "TECH SNIPER RIFLE",
            badge: "safe",
            questLabel: "Quest:",
            questName: "You Know My Name",
            details:
              "Received after the sniper turret sequence covering Reed's advance. Automatic quest reward.",
            tags: ["dlc", "main"],
          },
          {
            id: "gris-gris",
            name: "Gris-Gris",
            type: "TECH REVOLVER",
            badge: "care",
            questLabel: "Quest:",
            questName: "The Damned",
            details:
              "In the Voodoo Boys hideout. From the entrance go to the large multi-story circular room, reach the upper level, and go through the southwest door — weapon is in a case on a desk.",
            note:
              "REQUIRES Slider's Keycard — get it from the office in the Voodoo Boys base during Gig: Treating Symptoms (do this gig BEFORE The Damned). Without the keycard the door won't open.",
            tags: ["dlc", "main"],
          },
        ],
      },
      {
        label: "── FIRESTARTER BRANCH (CHOOSE ONE) ──────────",
        items: [
          {
            id: "bald-eagle-murphys-law",
            name: "Bald Eagle + Murphy's Law",
            type: "POWER REVOLVER + POWER AR",
            badge: "lock",
            questLabel: "Quest:",
            questName: "Firestarter (side with Reed)",
            details:
              "Both drop from Colonel Kurt Hansen when you kill him at the stadium exit.",
            note: "These are ONLY available on the Reed path. Siding with Songbird locks you out.",
            tags: ["dlc", "main"],
          },
          {
            id: "albert-murphys-weapon",
            name: "Albert Murphy's Weapon",
            type: "POWER PISTOL",
            badge: "lock",
            questLabel: "Quest:",
            questName: "Firestarter (side with Songbird)",
            details: "Drops from Albert Murphy. Only available on Songbird path.",
            note: "Siding with Reed locks you out of this weapon.",
            tags: ["dlc", "main"],
          },
        ],
      },
      {
        label: "── LATE STORY ────────────────────────────────",
        items: [
          {
            id: "canto",
            name: "Militech Canto Mk.6",
            type: "ICONIC QUICKHACK CYBERDECK",
            badge: "excl",
            questLabel: "Quest:",
            questName: "Somewhat Damaged → This Corrosion (Reed path)",
            details:
              "Crafting spec found during Somewhat Damaged (Tech 20 door). Give the Behavioral Component to Yoko in This Corrosion to craft.",
            note:
              "MUTUALLY EXCLUSIVE with Erebus — you can only craft one per playthrough. The Canto is a powerful Blackwall quickhack device that talks to V.",
            tags: ["dlc", "main"],
          },
          {
            id: "erebus",
            name: "Erebus",
            type: "POWER SMG (crafted)",
            badge: "excl",
            questLabel: "Quest:",
            questName: "Somewhat Damaged → This Corrosion (Reed path)",
            details:
              "Same crafting process as Canto. Crafting spec also in Somewhat Damaged, same Behavioral Component from Yoko.",
            note:
              "MUTUALLY EXCLUSIVE with Militech Canto Mk.6 — choose one. Erebus is a Blackwall-infused SMG that also talks to V.",
            tags: ["dlc", "main"],
          },
          {
            id: "pariah",
            name: "Pariah",
            type: "TECH PISTOL (silenced)",
            badge: "lock",
            questLabel: "Quest:",
            questName: "The Killing Moon (Songbird path)",
            details:
              "Drops from Reed if you side with Songbird and he becomes hostile. Only available on the Songbird ending.",
            note: "Reed path locks you out of this weapon.",
            tags: ["dlc", "main"],
          },
          {
            id: "ndi-osprey",
            name: "NDI Osprey",
            type: "POWER SNIPER RIFLE",
            badge: "miss",
            questLabel: "Location:",
            questName: "Alex's Safehouse in Dogtown",
            details:
              "Only accessible while Alex is still alive and the safehouse is active. Missable once the story progresses past that point.",
            tags: ["dlc", "main"],
          },
        ],
      },
    ],
  },
  {
    id: "base-side",
    title: "Base Game — Side Jobs",
    lineColor: "#00e57a",
    icon: "◈",
    subsections: [
      {
        label: "── SIDE JOBS (IN ORDER OF AVAILABILITY) ─────",
        items: [
          {
            id: "dying-night",
            name: "Dying Night",
            type: "POWER PISTOL",
            badge: "safe",
            questLabel: "Side Job:",
            questName: "The Gun",
            details:
              "Buy from Wilson in the weapon shop on floor 7 of V's apartment building. Triggers the first time you leave the apartment. Can return and buy anytime.",
            tags: ["base", "side"],
          },
          {
            id: "lexington",
            name: "Lexington x-MOD2",
            type: "POWER PISTOL",
            badge: "safe",
            questLabel: "Side Job:",
            questName: "Shoot to Thrill",
            details:
              "Win Wilson's shooting contest at the range. Can repeat at any point.",
            tags: ["base", "side"],
          },
          {
            id: "la-chingona",
            name: "La Chingona Dorada",
            type: "POWER PISTOLS (x2)",
            badge: "care",
            questLabel: "Side Job:",
            questName: "Heroes",
            details:
              "Jackie's iconic pistols on the offering table. REQUIRES sending Jackie's body to his family (not the morgue) at the end of The Heist.",
            note:
              "This side job is triggered by a choice in the main quest. Missing the choice = permanently lost.",
            tags: ["base", "side"],
          },
          {
            id: "sir-john",
            name: "Sir John Phallustiff",
            type: "ONE-HANDED CLUB",
            badge: "care",
            questLabel: "Side Job:",
            questName: "Venus in Furs (post-Pickup)",
            details:
              "From Meredith Stout after a rendezvous. Only unlocks if Stout survives The Pickup (don't get her killed). She messages you later.",
            tags: ["base", "side"],
          },
          {
            id: "doom-doom",
            name: "Doom Doom",
            type: "POWER REVOLVER",
            badge: "care",
            questLabel: "Side Job:",
            questName: "Second Conflict",
            details:
              "Loot from Dum Dum's body inside Totentanz. REQUIRES Dum Dum to have survived The Pickup in Act 1.",
            note:
              "If Dum Dum died during The Pickup, this weapon is permanently inaccessible.",
            nearby:
              "Nearby: Gold-Plated Baseball Bat is also in this mission, near the pool area.",
            tags: ["base", "side"],
          },
          {
            id: "gold-bat",
            name: "Gold-Plated Baseball Bat",
            type: "TWO-HANDED CLUB",
            badge: "miss",
            questLabel: "Side Job:",
            questName: "Second Conflict",
            details:
              "Found in the pool area after the confrontation. Grab it before leaving Totentanz.",
            nearby:
              "Nearby: Doom Doom drops from Dum Dum's body in the same mission (if he survived The Pickup).",
            tags: ["base", "side"],
          },
          {
            id: "death-and-taxes",
            name: "Death and Taxes",
            type: "POWER PISTOL",
            badge: "safe",
            questLabel: "Side Job:",
            questName: "Ex-Factor (Judy questline)",
            details:
              "In Maiko's office inside Clouds during the mission, or can be picked up from Judy's apartment afterward.",
            tags: ["base", "side"],
          },
          {
            id: "tsumetogi",
            name: "Tsumetogi",
            type: "KATANA",
            badge: "care",
            questLabel: "Side Job:",
            questName: "Pisces (Judy questline)",
            details:
              "Loot from Maiko in the screening room after the confrontation concludes. Only available if the mission plays out with violence.",
            tags: ["base", "side"],
          },
          {
            id: "mox",
            name: "Mox",
            type: "POWER SHOTGUN",
            badge: "safe",
            questLabel: "Side Job:",
            questName: "Judy questline end",
            details:
              "Given by Judy as a reward after completing her questline. Automatic reward.",
            tags: ["base", "side"],
          },
          {
            id: "widow-maker",
            name: "Widow Maker",
            type: "TECH PRECISION RIFLE",
            badge: "care",
            questLabel: "Side Job:",
            questName: "Ghost Town (Panam questline)",
            details:
              "Loot from Nash's corpse in the tunnel. Only available if you help Panam kill Nash — don't skip it.",
            tags: ["base", "side"],
          },
          {
            id: "problem-solver",
            name: "Problem Solver",
            type: "POWER SMG",
            badge: "care",
            questLabel: "Side Job:",
            questName: "Riders on the Storm (Panam questline)",
            details:
              "Dropped by a heavily armed enemy during the quest. Loot it before finishing the mission.",
            tags: ["base", "side"],
          },
          {
            id: "stinger",
            name: "Stinger",
            type: "KNIFE",
            badge: "care",
            questLabel: "Side Job:",
            questName: "With a Little Help From My Friends (Panam questline)",
            details:
              "Found in the area. Grab it before completing the mission as the location won't be revisitable.",
            tags: ["base", "side"],
          },
          {
            id: "overwatch",
            name: "Overwatch",
            type: "POWER SNIPER RIFLE",
            badge: "safe",
            questLabel: "Side Job:",
            questName: "Riders on the Storm / Panam questline end",
            details: "Given by Panam as a quest reward. Automatic reward.",
            tags: ["base", "side"],
          },
          {
            id: "nehan",
            name: "Nehan",
            type: "KNIFE",
            badge: "safe",
            questLabel: "Side Job:",
            questName: "I'll Fly Away (Panam/Mitch side job)",
            details:
              "Reward for the side job. Complete Riders on the Storm first, then Mitch invites you for a farewell for Scorpion.",
            tags: ["base", "side"],
          },
          {
            id: "divided-we-stand",
            name: "Divided We Stand",
            type: "SMART ASSAULT RIFLE",
            badge: "safe",
            questLabel: "Side Job:",
            questName: "Stadium Love",
            details:
              "Win or loot from a Sixer during the shooting contest. Can revisit the area.",
            tags: ["base", "side"],
          },
          {
            id: "headhunter",
            name: "Headhunter",
            type: "KNIFE",
            badge: "safe",
            questLabel: "Side Job:",
            questName: "The Hunt (River questline)",
            details:
              "Found in the control room of the Edgewood farm during the mission.",
            tags: ["base", "side"],
          },
          {
            id: "crash",
            name: "Crash",
            type: "POWER REVOLVER",
            badge: "safe",
            questLabel: "Side Job:",
            questName: "Following the River",
            details:
              "River gives you this on the water tower during the mission. Automatic quest reward.",
            tags: ["base", "side"],
          },
          {
            id: "fenrir",
            name: "Fenrir",
            type: "POWER SMG",
            badge: "safe",
            questLabel: "Side Job:",
            questName: "Losing My Religion / Sacrum Profanum",
            details:
              "On a table near the monk you rescue in a Maelstrom hideout near NID: Docks in Northside. Area stays accessible.",
            tags: ["base", "side"],
          },
          {
            id: "malorian",
            name: "Malorian Arms 3516",
            type: "POWER PISTOL",
            badge: "safe",
            questLabel: "Side Job:",
            questName: "Chippin' In (Johnny questline)",
            details:
              "Grayson hands you Johnny's pistol during the quest. Automatic reward. Has a slot in V's apartment.",
            tags: ["base", "side"],
          },
          {
            id: "archangel",
            name: "Archangel",
            type: "POWER REVOLVER",
            badge: "safe",
            questLabel: "Side Job:",
            questName: "A Like Supreme (Kerry questline)",
            details:
              "Kerry gives you this at the end of the reunion concert quest. Automatic reward.",
            tags: ["base", "side"],
          },
          {
            id: "apparition",
            name: "Apparition",
            type: "TECH PISTOL",
            badge: "care",
            questLabel: "Side Job:",
            questName: "War Pigs",
            details:
              "Corpo lifepath only. Loot from Frank Nostra's body at the end of the quest.",
            note:
              "LIFEPATH-LOCKED: Street Kid and Nomad cannot get this naturally. Available from Herold (Dogtown) if you have Phantom Liberty.",
            tags: ["base", "side"],
          },
          {
            id: "o-five",
            name: "O'Five",
            type: "POWER SNIPER RIFLE",
            badge: "care",
            questLabel: "Side Job:",
            questName: "Shooting challenge",
            details:
              "Beat Buck once, then either increase the wager or taunt him by staying. He and his goons attack — defeat him again and loot the rifle.",
            note: "Only drops on the second fight. Leaving after the first win loses the chance.",
            tags: ["base", "side"],
          },
          {
            id: "seraph",
            name: "Seraph",
            type: "POWER PISTOL",
            badge: "safe",
            questLabel: "Side Job:",
            questName: "God Bless This Mess",
            details:
              "Reward after completing all gigs for Ibarras in Heywood. Automatic reward once all gigs are done.",
            tags: ["base", "side"],
          },
        ],
      },
    ],
  },
  {
    id: "dlc-side",
    title: "Phantom Liberty — Side Gigs",
    lineColor: "#00c8ff",
    icon: "◈",
    subsections: [
      {
        label: "",
        items: [
          {
            id: "ogou",
            name: "Ogou",
            type: "SMART PISTOL",
            badge: "safe",
            questLabel: "Gig:",
            questName: "Treating Symptoms",
            details:
              "Dropped by the Robot R. Mk.2 boss inside the Luxor High Wellness Spa facility.",
            note:
              "IMPORTANT: Get Slider's Keycard from the office here too — required for Gris-Gris in The Damned main quest.",
            tags: ["dlc", "side"],
          },
          {
            id: "ambition",
            name: "Ambition",
            type: "TECH PISTOL",
            badge: "care",
            questLabel: "Gig:",
            questName: "Prototype in the Scraper / Side Job: Go Your Own Way",
            details:
              "Spare Hasan during the gig, then call Mr. Hands to let him go. Later a new quest triggers where you collect Ambition.",
            tags: ["dlc", "side"],
          },
          {
            id: "pizdets",
            name: "Pizdets",
            type: "SMART SMG (silenced)",
            badge: "safe",
            questLabel: "Gig:",
            questName: "Spy in the Jungle",
            details: "Kill Boris Ribakov. He drops this silenced smart SMG.",
            tags: ["dlc", "side"],
          },
          {
            id: "crimestopper",
            name: "Crimestopper",
            type: "SMART PISTOL",
            badge: "miss",
            questLabel: "Gig:",
            questName: "Heaviest of Hearts",
            details:
              "Inside VIP Room 6 in the Heavy Hearts club. Grab it while you're in the building.",
            tags: ["dlc", "side"],
          },
          {
            id: "rosco",
            name: "Rosco",
            type: "POWER REVOLVER",
            badge: "safe",
            questLabel: "Gig:",
            questName: "Waiting for Dodger",
            details:
              "Kill Dodger in the basement of the police station. Also available from the Black Market Vendor if missed.",
            tags: ["dlc", "side"],
          },
          {
            id: "mancinella",
            name: "Mancinella",
            type: "POWER REVOLVER",
            badge: "safe",
            questLabel: "Side Job:",
            questName: "Run This Town",
            details:
              "Mr. Hands gives you this as a reward. Unlocks after completing Firestarter. Wait for his call — several calls queue up post-Firestarter.",
            tags: ["dlc", "side"],
          },
          {
            id: "cheetah",
            name: "Cheetah",
            type: "POWER PISTOL",
            badge: "care",
            questLabel: "Side Job:",
            questName: "No Easy Way Out",
            details: "Dropped by Angie during the mission.",
            tags: ["dlc", "side"],
          },
          {
            id: "ol-reliable-riskit",
            name: "Ol' Reliable + Riskit",
            type: "POWER REVOLVER + POWER PISTOL",
            badge: "care",
            questLabel: "Side Job:",
            questName: "Shot By Both Sides",
            details:
              "Ol' Reliable drops from Dante. Riskit drops from Bree (or left on table if Dante dies and Bree leaves).",
            tags: ["dlc", "side"],
          },
          {
            id: "rook",
            name: "Rook",
            type: "POWER PISTOL",
            badge: "care",
            questLabel: "Side Job:",
            questName: "I've Seen That Face Before / Voodoo Treasure",
            details:
              "Eavesdrop on the twins' conversation in the car (ignore Reed 3 times). Grab the Blind_n_dead file from Aurore's corpse. Follow up with Voodoo Treasure, code 941229.",
            note:
              "The weapon can reportedly still be found at the location even if you didn't eavesdrop — worth checking regardless.",
            tags: ["dlc", "side"],
          },
        ],
      },
    ],
  },
  {
    id: "world",
    title: "Fixed World Locations",
    lineColor: "#ff8c00",
    icon: "◈",
    subsections: [
      {
        label: "── BASE GAME ──────────────────────────────────",
        items: [
          {
            id: "guts",
            name: "Guts",
            type: "POWER SHOTGUN",
            badge: "safe",
            questLabel: "Location:",
            questName: "Memorial Park, Corpo Plaza",
            details:
              "Hidden in the bushes in the southwest area of the ring where the monks hang out. Rebecca's shotgun from Edgerunners.",
            tags: ["base", "world"],
          },
          {
            id: "skippy",
            name: "Skippy",
            type: "SMART PISTOL",
            badge: "safe",
            questLabel: "Location:",
            questName: "Vista Del Rey, Heywood",
            details:
              "Side Job marker near College St. and the Shooting Range fast travel. Loot it from a body. Has its own side job (Machine Gun) that locks its mode after enough kills.",
            tags: ["base", "world"],
          },
          {
            id: "bfc-9000",
            name: "BFC 9000",
            type: "ONE-HANDED CLUB",
            badge: "safe",
            questLabel: "Location:",
            questName: "Cliffs near Petrochem Dam, Rancho Coronado",
            details:
              "Dropped by a crash-landed NPC in an AV on the cliffs. Spawn can be inconsistent — drive along the dam and look down.",
            tags: ["base", "world"],
          },
        ],
      },
      {
        label: "── PHANTOM LIBERTY (DOGTOWN) ─────────────────",
        items: [
          {
            id: "ma70",
            name: "MA70 HB x-MOD2",
            type: "POWER LMG",
            badge: "safe",
            questLabel: "Location:",
            questName: "Dogtown pyramid area",
            details:
              "Crashed AV covered with sheet metal. Requires Body 10 to rip the metal off.",
            tags: ["dlc", "world"],
          },
          {
            id: "claw",
            name: "Claw x-MOD2",
            type: "THROWABLE AXE",
            badge: "safe",
            questLabel: "Location:",
            questName: "Dogtown pyramid",
            details:
              "Climb to the very top of the Lonely Hearts pyramid. Found sticking out at the pinnacle.",
            tags: ["dlc", "world"],
          },
          {
            id: "kyubi",
            name: "Kyubi x-MOD2",
            type: "SMART ASSAULT RIFLE",
            badge: "safe",
            questLabel: "Location:",
            questName: "Pool near Golden Pacific fast travel, Dogtown",
            details:
              "Dive to the bottom of the pool. Found on a concrete block beneath a corpse that's been tied to the block.",
            tags: ["dlc", "world"],
          },
          {
            id: "guillotine",
            name: "Guillotine x-MOD2",
            type: "POWER SMG",
            badge: "safe",
            questLabel: "Location:",
            questName: "Dogtown, south of Kress Street",
            details:
              "Behind a door requiring Body 20 to force open. Alternatively accessible through a nearby window.",
            tags: ["dlc", "world"],
          },
          {
            id: "kappa",
            name: "Kappa x-MOD2",
            type: "SMART PISTOL",
            badge: "care",
            questLabel: "Location:",
            questName: "Northeast of Terra Cognita, Dogtown",
            details:
              "Behind a Body 10 barrier near a statue. Requires completion of Gig: Spy in the Jungle first, otherwise the weapon does not appear.",
            tags: ["dlc", "world"],
          },
          {
            id: "raiju",
            name: "Raiju",
            type: "TECH SMG",
            badge: "safe",
            questLabel: "Location:",
            questName: "West of Kress Street, Dogtown",
            details:
              "Increased Criminal Activity area full of Barghest enemies. Defeat the boss for a key, then open the nearby stash.",
            tags: ["dlc", "world"],
          },
          {
            id: "sparky",
            name: "Sparky",
            type: "POWER SNIPER RIFLE",
            badge: "safe",
            questLabel: "Location:",
            questName: "Southern Increased Criminal Activity area, Dogtown",
            details:
              "In a case in the far room along with a Militech equipment cache. Fires electric rounds on headshots.",
            tags: ["dlc", "world"],
          },
          {
            id: "agaou",
            name: "Agaou",
            type: "AXE",
            badge: "safe",
            questLabel: "Location:",
            questName: "Luxor High Wellness Spa, Dogtown",
            details:
              "Drop from the boss of the Increased Criminal Activity event on the upper level.",
            tags: ["dlc", "world"],
          },
        ],
      },
    ],
  },
  {
    id: "craft",
    title: "Crafting Specs & Vendors",
    lineColor: "#b060ff",
    icon: "⬡",
    subsections: [
      {
        label: "── NCPD SUSPECTED CRIME ACTIVITIES ───────────",
        items: [
          {
            id: "buzzsaw",
            name: "Buzzsaw",
            type: "POWER SMG (spec)",
            badge: "safe",
            questLabel: "Crafting Spec —",
            questName:
              "Northside, Watson: NCPD Suspected Crime Activity north of Pershing St.",
            details: "Drop from the gang leader.",
            tags: ["base", "craft"],
          },
          {
            id: "comrades-hammer",
            name: "Comrade's Hammer",
            type: "TECH REVOLVER (spec)",
            badge: "safe",
            questLabel: "Crafting Spec —",
            questName:
              "Arroyo, Santo Domingo: NCPD Suspected Crime Activity east of the Red Dirt Bar.",
            details: "Drop from the leader.",
            tags: ["base", "craft"],
          },
          {
            id: "moron-labe",
            name: "Moron Labe",
            type: "POWER ASSAULT RIFLE (spec)",
            badge: "safe",
            questLabel: "Crafting Spec —",
            questName: "West Wind Estate, Pacifica: NCPD Suspected Crime Activity.",
            details: "Drop from the leader.",
            tags: ["base", "craft"],
          },
          {
            id: "yinglong",
            name: "Yinglong",
            type: "SMART SMG (spec)",
            badge: "safe",
            questLabel: "Crafting Spec —",
            questName:
              "The Glen / southwest Wellsprings, Heywood: NCPD alert near Skyline and Ventura.",
            details: "Drop from the Animals leader.",
            tags: ["base", "craft"],
          },
        ],
      },
      {
        label: "── VENDORS ────────────────────────────────────",
        items: [
          {
            id: "blue-fang",
            name: "Blue Fang",
            type: "KNIFE",
            badge: "safe",
            questLabel: "Vendor:",
            questName: "Melee weapon merchant in the Badlands.",
            details: "Purchasable at any time.",
            tags: ["base", "vendor"],
          },
          {
            id: "order",
            name: "Order",
            type: "TECH DOUBLE-BARREL SHOTGUN",
            badge: "safe",
            questLabel: "Vendor:",
            questName: "Herold's Black Market, EBM Petrochem Stadium, Dogtown",
            details:
              "The gun he grabs from the hanging robot during his intro dance. Always in his inventory. Requires Phantom Liberty.",
            tags: ["dlc", "vendor"],
          },
        ],
      },
    ],
  },
];

/* ── Badge config ───────────────────────────────────────── */
const BADGE_CONFIG: Record<Badge, { label: string; cls: string }> = {
  miss: { label: "MISSABLE",    cls: "badgeMiss" },
  care: { label: "CAREFUL",     cls: "badgeCare" },
  safe: { label: "RETURNABLE",  cls: "badgeSafe" },
  lock: { label: "PATH-LOCKED", cls: "badgeLock" },
  post: { label: "POST-GAME",   cls: "badgePost" },
  excl: { label: "EXCLUSIVE",   cls: "badgeExcl" },
};

/* ── Helpers ────────────────────────────────────────────── */

/* ── Page ───────────────────────────────────────────────── */
export default function Cp2077Page() {
  useCp2077BodyClass();

  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [collectionFilter, setCollectionFilter] = useState<CollectionFilter>("all");
  const [badgeFilter, setBadgeFilter] = useState<BadgeFilter>(null);
  const [sectionFilter, setSectionFilter] = useState<SectionFilter>(null);
  const [weaponTypeFilter, setWeaponTypeFilter] = useState<WeaponTypeFilter>(null);
  const [weaponSubTypeFilter, setWeaponSubTypeFilter] = useState<WeaponSubTypeFilter>(null);
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  // Persist to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cp2077-checklist");
      if (saved) setChecked(new Set(JSON.parse(saved) as string[]));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cp2077-checklist", JSON.stringify([...checked]));
    } catch { /* ignore */ }
  }, [checked]);

  const allItems = useMemo(
    () => SECTIONS.flatMap((s) => s.subsections.flatMap((ss) => ss.items)),
    []
  );

  const totalCount = allItems.length;
  const checkedCount = checked.size;
  const progressPct = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  const toggleItem = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSection = (id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearAll = () => {
    setChecked(new Set());
    setCollectionFilter("all");
    setBadgeFilter(null);
    setSectionFilter(null);
    setWeaponTypeFilter(null);
    setWeaponSubTypeFilter(null);
  };

  const isVisible = (item: WeaponItem): boolean => {
    const q = search.toLowerCase();
    if (
      q &&
      !item.name.toLowerCase().includes(q) &&
      !(item.questName || "").toLowerCase().includes(q) &&
      !item.details.toLowerCase().includes(q)
    ) return false;

    if (collectionFilter === "collected"    && !checked.has(item.id)) return false;
    if (collectionFilter === "notcollected" &&  checked.has(item.id)) return false;

    if (badgeFilter !== null && item.badge !== badgeFilter) return false;

    if (sectionFilter !== null) {
      switch (sectionFilter) {
        case "base-main": if (!item.tags.includes("base") || !item.tags.includes("main")) return false; break;
        case "base-side": if (!item.tags.includes("base") || !item.tags.includes("side")) return false; break;
        case "dlc-main":  if (!item.tags.includes("dlc")  || !item.tags.includes("main")) return false; break;
        case "dlc-side":  if (!item.tags.includes("dlc")  || !item.tags.includes("side")) return false; break;
        case "world":     if (!item.tags.includes("world"))  return false; break;
        case "craft":     if (!item.tags.includes("craft"))  return false; break;
        case "vendor":    if (!item.tags.includes("vendor")) return false; break;
      }
    }

    if (weaponTypeFilter !== null) {
      const t = item.type.toUpperCase();
      switch (weaponTypeFilter) {
        case "pistol":          if (!t.includes("PISTOL"))          return false; break;
        case "revolver":        if (!t.includes("REVOLVER"))        return false; break;
        case "shotgun":         if (!t.includes("SHOTGUN"))         return false; break;
        case "smg":             if (!t.includes("SMG"))             return false; break;
        case "assault-rifle":   if (!t.includes("ASSAULT RIFLE") && !t.includes(" AR")) return false; break;
        case "precision-rifle": if (!t.includes("PRECISION"))       return false; break;
        case "sniper-rifle":    if (!t.includes("SNIPER"))          return false; break;
        case "one-handed-club": if (!t.includes("ONE-HANDED CLUB")) return false; break;
        case "two-handed-club": if (!t.includes("TWO-HANDED CLUB")) return false; break;
        case "knife":           if (!t.includes("KNIFE"))           return false; break;
        case "katana":          if (!t.includes("KATANA"))          return false; break;
        case "hammer":          if (!t.includes("HAMMER"))          return false; break;
        case "axe":             if (!t.includes("AXE"))             return false; break;
        case "lmg":             if (!t.includes("LMG"))             return false; break;
        case "other":
          if (["PISTOL","REVOLVER","SHOTGUN","SMG","RIFLE","LMG","KATANA","CLUB","KNIFE","HAMMER","AXE"].some((k) => t.includes(k))) return false;
          break;
      }
    }

    if (weaponSubTypeFilter !== null) {
      const t = item.type.toUpperCase();
      switch (weaponSubTypeFilter) {
        case "power":     if (!t.includes("POWER"))     return false; break;
        case "tech":      if (!t.includes("TECH"))      return false; break;
        case "smart":     if (!t.includes("SMART"))     return false; break;
        case "throwable": if (!t.includes("THROWABLE")) return false; break;
        case "melee":
          if (!["KATANA","CLUB","KNIFE","HAMMER","AXE"].some((k) => t.includes(k))) return false;
          break;
      }
    }

    return true;
  };

  const sectionProgress = (section: SectionData) => {
    const items = section.subsections.flatMap((ss) => ss.items);
    const done = items.filter((i) => checked.has(i.id)).length;
    return `${done}/${items.length}`;
  };

  return (
    <div className={styles.page}>

      {/* ── Header ──────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.titleBlock}>
            <h1>ICONIC WEAPONS // NIGHT CITY MANIFEST</h1>
            <p>CYBERPUNK 2077 + PHANTOM LIBERTY // PATCH 2.x REFERENCE</p>
          </div>
          <div className={styles.counter}>
            ⸻ {checkedCount} / {totalCount} ACQUIRED
          </div>
        </div>

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className={styles.legend}>
          {(Object.entries(BADGE_CONFIG) as [Badge, { label: string; cls: string }][]).map(
            ([, { label, cls }]) => (
              <div key={label} className={styles.legendItem}>
                <span className={`${styles.badge} ${styles[cls as keyof typeof styles]}`}>
                  {label}
                </span>
                {label === "MISSABLE"   && " permanently lost if skipped"}
                {label === "CAREFUL"    && " missable with conditions"}
                {label === "RETURNABLE" && " can come back anytime"}
                {label === "PATH-LOCKED"&& " specific ending/choice"}
                {label === "EXCLUSIVE"  && " mutually exclusive pick"}
                {label === "POST-GAME"  && " requires credits rollback"}
              </div>
            )
          )}
        </div>
      </header>

      {/* ── Search ──────────────────────────────────────── */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="// SEARCH WEAPON OR QUEST NAME..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── Filters ─────────────────────────────────────── */}
      <div className={styles.filterGroups}>

        {/* Group 1 — Collection status */}
        <div className={styles.filterGroup}>
          <span className={styles.filterGroupLabel}>STATUS</span>
          {(
            [
              { key: "all",          label: "ALL" },
              { key: "collected",    label: "COLLECTED" },
              { key: "notcollected", label: "NOT COLLECTED" },
            ] as { key: CollectionFilter; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              className={[styles.filterBtn, collectionFilter === key ? styles.filterBtnActive : ""].filter(Boolean).join(" ")}
              onClick={() => setCollectionFilter(key)}
            >{label}</button>
          ))}
        </div>

        {/* Group 2 — Badge type */}
        <div className={styles.filterGroup}>
          <span className={styles.filterGroupLabel}>BADGE</span>
          {(Object.entries(BADGE_CONFIG) as [Badge, { label: string; cls: string }][]).map(([badge, { label }]) => (
            <button
              key={badge}
              className={[styles.filterBtn, badgeFilter === badge ? styles.filterBtnActive : ""].filter(Boolean).join(" ")}
              onClick={() => setBadgeFilter((prev) => (prev === badge ? null : badge))}
            >{label}</button>
          ))}
        </div>

        {/* Group 3 — Source / section */}
        <div className={styles.filterGroup}>
          <span className={styles.filterGroupLabel}>SOURCE</span>
          {(
            [
              { key: "base-main", label: "MAIN STORY" },
              { key: "base-side", label: "MAIN STORY SIDE JOBS" },
              { key: "dlc-main",  label: "PHANTOM LIBERTY" },
              { key: "dlc-side",  label: "PHANTOM LIBERTY SIDE JOBS" },
              { key: "world",     label: "FIXED WORLD LOCATIONS" },
              { key: "craft",     label: "CRAFTING RECIPES" },
              { key: "vendor",    label: "VENDORS" },
            ] as { key: SectionFilter; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key as string}
              className={[styles.filterBtn, sectionFilter === key ? styles.filterBtnActive : ""].filter(Boolean).join(" ")}
              onClick={() => setSectionFilter((prev) => (prev === key ? null : key))}
            >{label}</button>
          ))}
        </div>

        {/* Group 4 — Weapon type */}
        <div className={styles.filterGroup}>
          <span className={styles.filterGroupLabel}>TYPE</span>
          {(
            [
              { key: "pistol",          label: "PISTOL" },
              { key: "revolver",        label: "REVOLVER" },
              { key: "shotgun",         label: "SHOTGUN" },
              { key: "smg",             label: "SMG" },
              { key: "assault-rifle",   label: "ASSAULT RIFLE" },
              { key: "precision-rifle", label: "PRECISION RIFLE" },
              { key: "sniper-rifle",    label: "SNIPER RIFLE" },
              { key: "one-handed-club", label: "ONE-HANDED CLUB" },
              { key: "two-handed-club", label: "TWO-HANDED CLUB" },
              { key: "knife",           label: "KNIFE" },
              { key: "katana",          label: "KATANA" },
              { key: "hammer",          label: "HAMMER" },
              { key: "axe",             label: "AXE" },
              { key: "lmg",             label: "LMG" },
              { key: "other",           label: "OTHER" },
            ] as { key: WeaponTypeFilter; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key as string}
              className={[styles.filterBtn, weaponTypeFilter === key ? styles.filterBtnActive : ""].filter(Boolean).join(" ")}
              onClick={() => setWeaponTypeFilter((prev) => (prev === key ? null : key))}
            >{label}</button>
          ))}
        </div>

        {/* Group 5 — Weapon sub-type */}
        <div className={styles.filterGroup}>
          <span className={styles.filterGroupLabel}>SUB-TYPE</span>
          {(
            [
              { key: "power",     label: "POWER" },
              { key: "tech",      label: "TECH" },
              { key: "smart",     label: "SMART" },
              { key: "throwable", label: "THROWABLE" },
              { key: "melee",     label: "MELEE" },
            ] as { key: WeaponSubTypeFilter; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key as string}
              className={[styles.filterBtn, weaponSubTypeFilter === key ? styles.filterBtnActive : ""].filter(Boolean).join(" ")}
              onClick={() => setWeaponSubTypeFilter((prev) => (prev === key ? null : key))}
            >{label}</button>
          ))}
        </div>

        <button className={styles.clearBtn} onClick={clearAll}>RESET ALL</button>
      </div>

      {/* ── Sections ────────────────────────────────────── */}
      <div className={styles.main}>
        {SECTIONS.map((section) => {
          const hasVisible = section.subsections.some((ss) =>
            ss.items.some(isVisible)
          );
          if (!hasVisible) return null;
          const isCollapsed = collapsed.has(section.id);

          return (
            <div key={section.id} className={styles.section}>
              <div
                className={styles.sectionHeader}
                onClick={() => toggleSection(section.id)}
              >
                <div
                  className={styles.sectionLine}
                  style={{ background: section.lineColor }}
                />
                <span className={styles.sectionIcon}>{section.icon}</span>
                <span className={styles.sectionTitle}>{section.title}</span>
                <span className={styles.sectionCount}>
                  {sectionProgress(section)}
                </span>
                <span className={styles.sectionToggle}>
                  {isCollapsed ? "▶" : "▼"}
                </span>
              </div>

              {!isCollapsed && (
                <div className={styles.itemsList}>
                  {section.subsections.map((sub, si) => {
                    const visibleItems = sub.items.filter(isVisible);
                    if (visibleItems.length === 0) return null;
                    return (
                      <div key={si}>
                        {sub.label && (
                          <div className={styles.subsectionLabel}>
                            {sub.label}
                          </div>
                        )}
                        {visibleItems.map((item) => {
                          const isChecked = checked.has(item.id);
                          const badge = BADGE_CONFIG[item.badge];
                          return (
                            <div
                              key={item.id}
                              className={[
                                styles.item,
                                isChecked ? styles.itemChecked : "",
                              ]
                                .filter(Boolean)
                                .join(" ")}
                              onClick={() => toggleItem(item.id)}
                            >
                              <div
                                className={[
                                  styles.itemCheck,
                                  isChecked ? styles.itemCheckDone : "",
                                ]
                                  .filter(Boolean)
                                  .join(" ")}
                              >
                                {isChecked && "✓"}
                              </div>
                              <div className={styles.itemBody}>
                                <div className={styles.itemTop}>
                                  <span className={styles.itemName}>
                                    {item.name}
                                  </span>
                                  <span className={styles.itemType}>
                                    {item.type}
                                  </span>
                                  <span
                                    className={`${styles.badge} ${styles[badge.cls as keyof typeof styles]}`}
                                  >
                                    {badge.label}
                                  </span>
                                </div>
                                <div className={styles.itemDetails}>
                                  {item.questLabel}{" "}
                                  {item.questName && (
                                    <span className={styles.questName}>
                                      {item.questName}
                                    </span>
                                  )}{" "}
                                  — {item.details}
                                  {item.note && (
                                    <div className={styles.note}>
                                      ⸻ {item.note}
                                    </div>
                                  )}
                                  {item.nearby && (
                                    <div className={styles.nearby}>
                                      ⸻ {item.nearby}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Footer ──────────────────────────────────────── */}
      <div className={styles.backLink}>
        <Link href="/">← Back to Portfolio</Link>
      </div>
    </div>
  );
}
