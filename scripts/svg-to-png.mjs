#!/usr/bin/env node
// Convert social card SVG(s) to PNG(s) (1200x630)
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { dirname } from 'node:path'
import sharp from 'sharp'

async function convertOne(svgPath, pngPath){
  const svg = readFileSync(svgPath)
  const image = sharp(svg, { density: 192 }) // ~2x for crisp text
  const png = await image
    .resize(1200, 630, { fit: 'cover' })
    .png({ compressionLevel: 9 })
    .toBuffer()
  writeFileSync(pngPath, png)
  console.log('Wrote', pngPath)
}

async function main(){
  const args = process.argv.slice(2)
  const argVar = args.find(a=>a.startsWith('--variant='))
  const all = args.includes('--all')
  const assetsDir = new URL('../assets/', import.meta.url).pathname
  if (all){
    const files = readdirSync(assetsDir)
      .filter(f=> f.startsWith('social-card-') && f.endsWith('.svg'))
    for (const f of files){
      const svgPath = new URL(`../assets/${f}`, import.meta.url).pathname
      const pngName = f.replace(/\.svg$/,'.png')
      const pngPath = new URL(`../assets/${pngName}`, import.meta.url).pathname
      await convertOne(svgPath, pngPath)
    }
    return
  }
  const variant = argVar ? argVar.split('=')[1] : ''
  if (variant){
    const svgPath = new URL(`../assets/social-card-${variant}.svg`, import.meta.url).pathname
    const pngPath = new URL(`../assets/social-card-${variant}.png`, import.meta.url).pathname
    await convertOne(svgPath, pngPath)
    return
  }
  // default: classic only
  const svgPath = new URL('../assets/social-card.svg', import.meta.url).pathname
  const pngPath = new URL('../assets/social-card.png', import.meta.url).pathname
  await convertOne(svgPath, pngPath)
}

main().catch((e)=>{ console.error(e); process.exit(1) })
