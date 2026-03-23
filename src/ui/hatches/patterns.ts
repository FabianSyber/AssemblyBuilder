export interface HatchPattern {
  id: string
  type: string
  width: number
  height: number
  fill: string
  strokeColor: string
  svgContent: string
}

export const HATCH_PATTERNS: Record<string, HatchPattern> = {
  concrete: { id: 'hatch-concrete', type: 'concrete', width: 10, height: 10, fill: 'var(--layer-concrete)', strokeColor: 'rgba(180,160,200,0.4)', svgContent: '<circle cx="3" cy="3" r="1.2" fill="rgba(180,160,200,0.4)"/><circle cx="8" cy="8" r="0.8" fill="rgba(180,160,200,0.3)"/><circle cx="6" cy="2" r="0.6" fill="rgba(180,160,200,0.25)"/>' },
  insulation: { id: 'hatch-insulation', type: 'insulation', width: 24, height: 12, fill: 'var(--layer-insulation)', strokeColor: 'rgba(236,112,160,0.35)', svgContent: '<path d="M0,6 Q6,0 12,6 Q18,12 24,6" fill="none" stroke="rgba(236,112,160,0.35)" stroke-width="1"/>' },
  wood: { id: 'hatch-wood', type: 'wood', width: 30, height: 6, fill: 'var(--layer-wood)', strokeColor: 'rgba(180,140,100,0.3)', svgContent: '<path d="M0,3 Q15,1 30,3" fill="none" stroke="rgba(180,140,100,0.3)" stroke-width="0.7"/><path d="M0,5 Q10,4 30,6" fill="none" stroke="rgba(180,140,100,0.2)" stroke-width="0.4"/>' },
  membrane: { id: 'hatch-membrane', type: 'membrane', width: 8, height: 8, fill: 'var(--layer-membrane)', strokeColor: 'rgba(130,180,220,0.3)', svgContent: '<path d="M0,8 L8,0" fill="none" stroke="rgba(130,180,220,0.3)" stroke-width="0.6"/>' },
  steel: { id: 'hatch-steel', type: 'steel', width: 8, height: 8, fill: 'var(--layer-steel)', strokeColor: 'rgba(100,120,160,0.35)', svgContent: '<path d="M0,8 L8,0" fill="none" stroke="rgba(100,120,160,0.35)" stroke-width="0.5"/><path d="M0,0 L8,8" fill="none" stroke="rgba(100,120,160,0.25)" stroke-width="0.5"/>' },
  air: { id: 'hatch-air', type: 'air', width: 12, height: 12, fill: 'var(--layer-air)', strokeColor: 'rgba(180,200,230,0.3)', svgContent: '<rect x="0.5" y="0.5" width="11" height="11" fill="none" stroke="rgba(180,200,230,0.3)" stroke-width="0.5" stroke-dasharray="2,2"/>' },
  brick: { id: 'hatch-brick', type: 'brick', width: 20, height: 10, fill: 'var(--layer-brick)', strokeColor: 'rgba(180,140,120,0.35)', svgContent: '<rect x="0" y="0" width="20" height="5" fill="none" stroke="rgba(180,140,120,0.35)" stroke-width="0.5"/><rect x="10" y="5" width="20" height="5" fill="none" stroke="rgba(180,140,120,0.35)" stroke-width="0.5"/>' },
  gypsum: { id: 'hatch-gypsum', type: 'gypsum', width: 6, height: 6, fill: 'var(--layer-gypsum)', strokeColor: 'rgba(180,170,200,0.25)', svgContent: '<circle cx="3" cy="3" r="0.5" fill="rgba(180,170,200,0.25)"/>' },
  earth: { id: 'hatch-earth', type: 'earth', width: 12, height: 12, fill: 'var(--layer-earth)', strokeColor: 'rgba(160,140,110,0.35)', svgContent: '<circle cx="3" cy="3" r="1" fill="rgba(160,140,110,0.35)"/><circle cx="9" cy="9" r="0.7" fill="rgba(160,140,110,0.25)"/><path d="M6,6 L8,6" fill="none" stroke="rgba(160,140,110,0.3)" stroke-width="0.5"/>' },
}

export function getPattern(type: string): HatchPattern {
  return HATCH_PATTERNS[type] ?? HATCH_PATTERNS.concrete
}
