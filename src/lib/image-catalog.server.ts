import "server-only";

import fs from "node:fs";

import path from "node:path";



const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;



/** Recursively collect image paths under /public (web paths like /images/foo.jpg). */

export function scanPublicImages(): string[] {

  const publicDir = path.join(process.cwd(), "public");

  const found: string[] = [];



  function walk(dir: string, webPrefix: string) {

    if (!fs.existsSync(dir)) return;

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {

      const full = path.join(dir, entry.name);

      const webPath = `${webPrefix}/${entry.name}`.replace(/\/+/g, "/");

      if (entry.isDirectory()) {

        walk(full, webPath);

      } else if (IMAGE_EXT.test(entry.name)) {

        found.push(webPath);

      }

    }

  }



  walk(publicDir, "");

  return [...new Set(found)].sort();

}



/** Group scanned paths by service folder under /images. */

export function categorizeImages(paths: string[]) {

  const groups = {

    all: paths,

    gallery: [] as string[],

    clients: [] as string[],

    pages: [] as string[],

    services: [] as string[],

    invisibleGrills: [] as string[],

    safetyNets: [] as string[],

    birdControl: [] as string[],

    sportsNets: [] as string[],

    clothHangers: [] as string[],

    industrial: [] as string[],

    heroes: [] as string[],

  };



  for (const src of paths) {

    const lower = src.toLowerCase();

    if (lower.includes("/invisible-grill")) {

      groups.invisibleGrills.push(src);

      groups.services.push(src);

      groups.gallery.push(src);

    } else if (lower.includes("/safety-nets") || lower.includes("/child-safety") || lower.includes("/pet-safety")) {

      groups.safetyNets.push(src);

      groups.services.push(src);

      groups.gallery.push(src);

    } else if (lower.includes("/bird-spikes")) {

      groups.birdControl.push(src);

      groups.services.push(src);

      groups.gallery.push(src);

    } else if (lower.includes("/cricket-nets")) {

      groups.sportsNets.push(src);

      groups.services.push(src);

      groups.gallery.push(src);

    } else if (lower.includes("/cloth-hangers")) {

      groups.clothHangers.push(src);

      groups.services.push(src);

      groups.gallery.push(src);

    } else if (lower.includes("/duct-area") || lower.includes("/mosquito")) {

      groups.industrial.push(src);

      groups.services.push(src);

      groups.gallery.push(src);

    } else {

      groups.services.push(src);

      groups.gallery.push(src);

    }

  }



  groups.heroes = [

    ...groups.invisibleGrills.slice(0, 3),

    ...groups.safetyNets.slice(0, 3),

    ...groups.gallery.slice(0, 2),

  ];



  groups.clients = [

    groups.invisibleGrills[0],

    groups.safetyNets[0],

    groups.sportsNets[0],

    groups.clothHangers[0],

    groups.birdControl[0],

    groups.industrial[0],

  ].filter(Boolean) as string[];



  return groups;

}



export function getServerImageCatalog() {

  const all = scanPublicImages();

  return categorizeImages(all);

}


