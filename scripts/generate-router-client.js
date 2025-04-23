// scripts/generate-router-client.js
const fs = require("fs");
const path = require("path");
const glob = require("fast-glob");

const ROUTES_PATH = "src/server/apps";
const OUTPUT_CLIENT_FILE = "src/shared/routes/routerClient.ts";
const OUTPUT_SCHEMA_FILE = "src/shared/routes/routerSchemas.ts";

const routeMap = new Map(); // routeName -> rawSchemaExpr
const schemaNames = new Set(); // candidate schema identifiers

// Step 1: Find all defineRoute usages via regex
const urlFiles = glob.sync(`${ROUTES_PATH}/**/urls.ts`);
for (const file of urlFiles) {
    // 1) Read the raw text
    const raw = fs.readFileSync(file, "utf8");

    // 2) Strip single-line (//…) and block (/*…*/ ) comments
    const content = raw
        .replace(/\/\/.*$/gm, "") // remove // comments
        .replace(/\/\*[\s\S]*?\*\//g, ""); // remove /* */ comments

    // Now use `content` (not `raw`) for all your regexes…

    // ————————————————————————————————————
    //  CRUD extractor
    // ————————————————————————————————————
    const crudAllRegex = /generateCrudRoutes\(\s*['"]([^'"]+)['"]\s*,\s*(\{[\s\S]*?\})\s*,/g;
    let crudAllMatch;
    while ((crudAllMatch = crudAllRegex.exec(content))) {
        const moduleName = crudAllMatch[1];
        const schemaObjectStr = crudAllMatch[2];

        const pairRegex = /(\w+)\s*:\s*([\w$]+)/g;
        let pairMatch;
        while ((pairMatch = pairRegex.exec(schemaObjectStr))) {
            const routeName = pairMatch[1];
            const schemaExpr = pairMatch[2];
            routeMap.set(`${moduleName}:${routeName}`, schemaExpr);
            schemaNames.add(schemaExpr);
        }
    }

    // ————————————————————————————————————
    //  registerRoutes(...) extractor
    // ————————————————————————————————————
    const multiRouteRegex = /registerRoutes\(\s*["']([^"']+)["']\s*,\s*\[((?:.|\n)*?)\]\s*\)/g;
    let multiMatch;
    while ((multiMatch = multiRouteRegex.exec(content))) {
        const moduleName = multiMatch[1];
        const routeBlock = multiMatch[2];

        const defineRouteRegex = /defineRoute\(([^,]+),\s*{[\s\S]*?name\s*:\s*["']([^"']+)["']/g;
        let routeMatch;
        while ((routeMatch = defineRouteRegex.exec(routeBlock))) {
            const schemaExpr = routeMatch[1].trim();
            const routeName = routeMatch[2].trim();
            const fullName = `${moduleName}:${routeName}`;
            routeMap.set(fullName, schemaExpr);

            if (!schemaExpr.startsWith("t.")) {
                const id = schemaExpr.replace(/<.*>$/, "").replace(/\(.+\)/, schemaExpr);
                schemaNames.add(id);
            }
        }
    }

    // Match registerRoute(defineRoute(...)) — no namespacing
    const singleRouteRegex = /registerRoute\(\s*defineRoute\(([^,]+),\s*{[\s\S]*?name\s*:\s*["']([^"']+)["']/g;
    let singleMatch;
    while ((singleMatch = singleRouteRegex.exec(content))) {
        const schemaExpr = singleMatch[1].trim();
        const routeName = singleMatch[2].trim();

        routeMap.set(routeName, schemaExpr);

        if (!schemaExpr.startsWith("t.")) {
            const id = schemaExpr.replace(/<.*>$/, "").replace(/\(.+\)/, schemaExpr);
            schemaNames.add(id);
        }
    }
}


// Step 2: Extract schema definitions via regex from models.ts
const schemaDefs = new Map(); // schemaName -> initializer string
const modelFiles = glob.sync(`${ROUTES_PATH}/**/models.ts`);
for (const file of modelFiles) {
    const content = fs.readFileSync(file, "utf8");
    for (const name of schemaNames) {
        if (schemaDefs.has(name)) continue;
        const pat = new RegExp(`export\\s+const\\s+${name}\\s*=\\s*([\\s\\S]*?);`);
        const m = content.match(pat);
        if (m) {
            schemaDefs.set(name, m[1].trim());
        }
    }
}

// Step 2.5: Sort schemas topologically by dependency
function getSchemaDeps(body) {
    return Array.from(schemaDefs.keys()).filter((name) => body.includes(name));
}

function topologicalSortSchemas(schemas) {
    const sorted = [];
    const visited = new Set();
    const visiting = new Set();

    function visit(name) {
        if (visited.has(name)) return;
        if (visiting.has(name)) return; // circular, skip
        visiting.add(name);
        const deps = getSchemaDeps(schemas.get(name));
        for (const dep of deps) {
            if (schemas.has(dep)) visit(dep);
        }
        visiting.delete(name);
        visited.add(name);
        sorted.push(name);
    }

    for (const key of schemas.keys()) visit(key);
    return sorted;
}



// Step 4: Write routerSchemas.ts
fs.mkdirSync(path.dirname(OUTPUT_SCHEMA_FILE), {
    recursive: true
});
const schemaHeader = `import { t } from "@rbxts/t";\n\n`;
const ordered = topologicalSortSchemas(schemaDefs);
const schemaBody = ordered
    .map((name) => `export const ${name} = ${schemaDefs.get(name)};`)
    .join("\n\n");
fs.writeFileSync(OUTPUT_SCHEMA_FILE, schemaHeader + schemaBody);

// Step 5: Write routerClient.ts
fs.mkdirSync(path.dirname(OUTPUT_CLIENT_FILE), {
    recursive: true
});
const clientHeader = `import type { t } from "@rbxts/t";\nimport type { ${ordered.join(", ")} } from "./routerSchemas";\nimport { getRouterClient } from "@rbxts/router";\n\nconst routerFunction = getRouterClient();\n\n`;
const clientBody = `export const routerClient = {\n${[...routeMap.entries()]
  .map(
    ([name, schema]) =>
      `  "${name}": (payload: t.static<typeof ${schema}>) => routerFunction.InvokeServer("${name}", payload),`
  )
  .join("\n")}\n} as const;\n`;
fs.writeFileSync(OUTPUT_CLIENT_FILE, clientHeader + clientBody);

console.log(`✅ Generated:\n  • ${OUTPUT_SCHEMA_FILE} (${schemaDefs.size} schemas)\n  • ${OUTPUT_CLIENT_FILE} (${routeMap.size} routes)`);