// ReactionEngine.js — Pure logic module for chemical reactions

const REACTIONS = [
  {
    reactants: ['Zn', 'HCl'],
    type: 'Single Displacement',
    products: ['ZnCl₂', 'H₂↑'],
    equation: 'Zn + 2HCl → ZnCl₂ + H₂↑',
    ionicEquation: 'Zn(s) + 2H⁺(aq) + 2Cl⁻(aq) → Zn²⁺(aq) + 2Cl⁻(aq) + H₂(g)',
    animation: 'bubbles',
    safety: 'safe',
    explanation: {
      6: 'Zinc reacts with the acid and makes bubbles! The bubbles are hydrogen gas.',
      7: 'Zinc displaces hydrogen from hydrochloric acid. The bubbles you see are hydrogen gas (H₂).',
      8: 'This is a single displacement reaction. Zinc is more reactive than hydrogen, so it replaces H in HCl.',
      10: 'Zn + 2HCl → ZnCl₂ + H₂↑. Zinc displaces hydrogen from HCl as Zn is higher in the reactivity series.',
      12: 'Zn(s) + 2H⁺(aq) → Zn²⁺(aq) + H₂(g). E° = +0.76V. Thermodynamically favorable single displacement.',
    },
    atomicChanges: { electron_transfer: true, from: 'Zn', to: 'H⁺', electrons: 2 },
    didYouKnow: 'Zinc is used to galvanize steel — coating it to prevent rusting! 🛡️',
    requiresApparatus: true,
  },
  {
    reactants: ['Mg', 'HCl'],
    type: 'Single Displacement',
    products: ['MgCl₂', 'H₂↑'],
    equation: 'Mg + 2HCl → MgCl₂ + H₂↑',
    ionicEquation: 'Mg(s) + 2H⁺(aq) → Mg²⁺(aq) + H₂(g)',
    animation: 'vigorous_bubbles',
    safety: 'safe',
    explanation: {
      6: 'Magnesium fizzes a lot in acid! It makes hydrogen gas bubbles.',
      7: 'Magnesium reacts vigorously with HCl producing hydrogen gas and magnesium chloride.',
      10: 'Mg + 2HCl → MgCl₂ + H₂↑. Magnesium is very reactive — higher than Zn in the activity series.',
      12: 'Mg(s) + 2H⁺(aq) → Mg²⁺(aq) + H₂(g). ΔG is highly negative, reaction is fast and exothermic.',
    },
    atomicChanges: { electron_transfer: true, from: 'Mg', to: 'H⁺', electrons: 2 },
    didYouKnow: 'Magnesium burns so bright it was used in old camera flash bulbs! 📸',
    requiresApparatus: true,
  },
  {
    reactants: ['Fe', 'HCl'],
    type: 'Single Displacement',
    products: ['FeCl₂', 'H₂↑'],
    equation: 'Fe + 2HCl → FeCl₂ + H₂↑',
    ionicEquation: 'Fe(s) + 2H⁺(aq) → Fe²⁺(aq) + H₂(g)',
    animation: 'slow_bubbles',
    safety: 'safe',
    explanation: {
      6: 'Iron slowly reacts with acid. You can see tiny bubbles forming.',
      7: 'Iron reacts slowly with HCl to form iron(II) chloride and hydrogen gas.',
      10: 'Fe + 2HCl → FeCl₂ + H₂↑. Iron is less reactive than Zn/Mg so the reaction is slower.',
      12: 'Fe(s) + 2H⁺(aq) → Fe²⁺(aq) + H₂(g). Note: Fe forms Fe²⁺ not Fe³⁺ with dilute HCl.',
    },
    atomicChanges: { electron_transfer: true, from: 'Fe', to: 'H⁺', electrons: 2 },
    didYouKnow: 'Iron makes up about 5% of Earth\'s crust and most of its core! 🌍',
    requiresApparatus: true,
  },
  {
    reactants: ['Na', 'H₂O'],
    type: 'Reactive Metal + Water',
    products: ['NaOH', 'H₂↑'],
    equation: '2Na + 2H₂O → 2NaOH + H₂↑',
    ionicEquation: '2Na(s) + 2H₂O(l) → 2Na⁺(aq) + 2OH⁻(aq) + H₂(g)',
    animation: 'explosion',
    safety: 'dangerous',
    kaboom: true,
    explanation: {
      6: '💥 DANGER! Sodium explodes in water! Never try this without safety gear!',
      7: 'Sodium is so reactive it catches fire in water! It produces NaOH and hydrogen gas.',
      10: '2Na + 2H₂O → 2NaOH + H₂↑. Highly exothermic. The H₂ produced ignites from the heat.',
      12: '2Na(s) + 2H₂O(l) → 2Na⁺(aq) + 2OH⁻(aq) + H₂(g). ΔH = -184 kJ/mol. Violently exothermic.',
    },
    safetyExplanation: 'Sodium is an alkali metal (Group 1). It reacts violently with water because it easily loses its single valence electron. The reaction produces so much heat that the hydrogen gas ignites!',
    atomicChanges: { electron_transfer: true, from: 'Na', to: 'H₂O', electrons: 1 },
    didYouKnow: 'Sodium is stored under kerosene/oil to prevent contact with moisture in the air! 🛢️',
    requiresApparatus: false,
  },
  {
    reactants: ['K', 'H₂O'],
    type: 'Reactive Metal + Water',
    products: ['KOH', 'H₂↑'],
    equation: '2K + 2H₂O → 2KOH + H₂↑',
    animation: 'explosion',
    safety: 'dangerous',
    kaboom: true,
    explanation: {
      6: '💥 KABOOM! Potassium is even more explosive than sodium in water!',
      10: '2K + 2H₂O → 2KOH + H₂↑. Potassium is below Na in Group 1, making it even more reactive.',
      12: '2K(s) + 2H₂O(l) → 2K⁺(aq) + 2OH⁻(aq) + H₂(g). ΔH = -196 kJ/mol. Purple flame observed.',
    },
    safetyExplanation: 'Potassium is even more reactive than sodium! It sits lower in Group 1, meaning its outer electron is further from the nucleus and easier to lose. The reaction is violently exothermic with a characteristic purple/lilac flame.',
    atomicChanges: { electron_transfer: true, from: 'K', to: 'H₂O', electrons: 1 },
    requiresApparatus: false,
  },
  {
    reactants: ['Ca', 'H₂O'],
    type: 'Metal + Water',
    products: ['Ca(OH)₂', 'H₂↑'],
    equation: 'Ca + 2H₂O → Ca(OH)₂ + H₂↑',
    animation: 'bubbles',
    safety: 'caution',
    explanation: {
      6: 'Calcium fizzes gently in water and makes it cloudy — that\'s lime water!',
      10: 'Ca + 2H₂O → Ca(OH)₂ + H₂↑. Less vigorous than Na/K. The solution becomes alkaline (milky).',
      12: 'Ca(s) + 2H₂O(l) → Ca²⁺(aq) + 2OH⁻(aq) + H₂(g). Moderately exothermic. Ca(OH)₂ is sparingly soluble.',
    },
    atomicChanges: { electron_transfer: true, from: 'Ca', to: 'H₂O', electrons: 2 },
    requiresApparatus: true,
  },
  {
    reactants: ['NaOH', 'HCl'],
    type: 'Neutralization',
    products: ['NaCl', 'H₂O'],
    equation: 'NaOH + HCl → NaCl + H₂O',
    ionicEquation: 'OH⁻(aq) + H⁺(aq) → H₂O(l)',
    animation: 'heat_shimmer',
    safety: 'caution',
    explanation: {
      6: 'The acid and base cancel each other out and make salt water! Feel the warmth!',
      7: 'An acid + a base = salt + water. This is called neutralization. NaOH + HCl → NaCl + H₂O.',
      10: 'Strong acid + strong base → complete neutralization. pH changes from extreme to ~7.',
      12: 'Net ionic: OH⁻(aq) + H⁺(aq) → H₂O(l). ΔH = -57.1 kJ/mol. Enthalpy of neutralization.',
    },
    atomicChanges: { electron_transfer: false, bond_formation: true },
    didYouKnow: 'Antacids work by neutralization — they\'re bases that neutralize excess stomach acid (HCl)! 💊',
    requiresApparatus: true,
  },
  {
    reactants: ['KOH', 'H₂SO₄'],
    type: 'Neutralization',
    products: ['K₂SO₄', 'H₂O'],
    equation: '2KOH + H₂SO₄ → K₂SO₄ + 2H₂O',
    animation: 'heat_shimmer',
    safety: 'caution',
    explanation: {
      7: 'Potassium hydroxide neutralizes sulfuric acid to form potassium sulfate and water.',
      10: '2KOH + H₂SO₄ → K₂SO₄ + 2H₂O. H₂SO₄ is diprotic — needs 2 moles of base.',
      12: '2OH⁻(aq) + 2H⁺(aq) → 2H₂O(l). ΔH ≈ -114 kJ for 2 mol neutralizations.',
    },
    atomicChanges: { electron_transfer: false, bond_formation: true },
    requiresApparatus: true,
  },
  {
    reactants: ['Mg', 'O₂'],
    type: 'Combustion',
    products: ['MgO'],
    equation: '2Mg + O₂ → 2MgO',
    animation: 'fire',
    safety: 'caution',
    explanation: {
      6: 'Magnesium burns with a super bright white light! Don\'t look directly at it! ✨',
      7: 'Magnesium burns in oxygen with a brilliant white flame to form magnesium oxide (white ash).',
      10: '2Mg + O₂ → 2MgO. Combustion reaction. The bright light is due to the highly exothermic nature.',
      12: '2Mg(s) + O₂(g) → 2MgO(s). ΔH = -1204 kJ/mol. Ionic bonding in product (Mg²⁺ O²⁻).',
    },
    atomicChanges: { electron_transfer: true, from: 'Mg', to: 'O', electrons: 2 },
    didYouKnow: 'Magnesium flares are used in emergency signaling because they burn underwater! 🔥',
    requiresApparatus: false,
  },
  {
    reactants: ['C', 'O₂'],
    type: 'Combustion',
    products: ['CO₂'],
    equation: 'C + O₂ → CO₂',
    animation: 'fire',
    safety: 'safe',
    explanation: {
      6: 'Carbon burns to make carbon dioxide — the gas we breathe out!',
      10: 'C + O₂ → CO₂. Complete combustion of carbon. The gas turns limewater milky.',
      12: 'C(s) + O₂(g) → CO₂(g). ΔH = -393.5 kJ/mol. Covalent bonding in CO₂ (O=C=O).',
    },
    atomicChanges: { electron_transfer: false, electron_sharing: true },
    requiresApparatus: false,
  },
  {
    reactants: ['Cu', 'HCl'],
    type: 'No Reaction',
    products: [],
    equation: 'Cu + HCl → No Reaction',
    animation: 'none',
    safety: 'safe',
    explanation: {
      6: 'Nothing happens! Copper doesn\'t react with this acid.',
      7: 'Copper is below hydrogen in the reactivity series, so it cannot displace hydrogen from HCl.',
      10: 'Cu + HCl → No reaction. Cu has a positive reduction potential (+0.34V) — less reactive than H₂.',
      12: 'E°(Cu²⁺/Cu) = +0.34V > E°(H⁺/H₂) = 0V. ΔG > 0, so the reaction is non-spontaneous.',
    },
    atomicChanges: null,
    didYouKnow: 'Copper is used in electrical wiring because it\'s an excellent conductor — and unreactive enough to last! ⚡',
    requiresApparatus: true,
  },
  {
    reactants: ['Au', 'HCl'],
    type: 'No Reaction',
    products: [],
    equation: 'Au + HCl → No Reaction',
    animation: 'none',
    safety: 'safe',
    explanation: {
      6: 'Gold doesn\'t react! That\'s why gold jewelry stays shiny forever! ✨',
      10: 'Gold is the least reactive metal. Only aqua regia (HCl + HNO₃) can dissolve it.',
      12: 'E°(Au³⁺/Au) = +1.50V. Extremely noble metal. Requires aqua regia for dissolution.',
    },
    atomicChanges: null,
    requiresApparatus: true,
  },
  {
    reactants: ['H₂SO₄', 'NaOH'],
    type: 'Neutralization',
    products: ['Na₂SO₄', 'H₂O'],
    equation: 'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O',
    animation: 'heat_shimmer',
    safety: 'caution',
    explanation: {
      7: 'Sulfuric acid is neutralized by sodium hydroxide to form sodium sulfate and water.',
      10: 'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O. Diprotic acid requires two moles of base.',
    },
    atomicChanges: { electron_transfer: false, bond_formation: true },
    requiresApparatus: true,
  },
  {
    reactants: ['Al', 'HCl'],
    type: 'Single Displacement',
    products: ['AlCl₃', 'H₂↑'],
    equation: '2Al + 6HCl → 2AlCl₃ + 3H₂↑',
    animation: 'bubbles',
    safety: 'safe',
    explanation: {
      7: 'Aluminum reacts with hydrochloric acid to produce aluminum chloride and hydrogen gas.',
      10: '2Al + 6HCl → 2AlCl₃ + 3H₂↑. Al loses 3 electrons per atom.',
      12: '2Al(s) + 6H⁺(aq) → 2Al³⁺(aq) + 3H₂(g). Oxide layer must dissolve first.',
    },
    atomicChanges: { electron_transfer: true, from: 'Al', to: 'H⁺', electrons: 3 },
    requiresApparatus: true,
  },
  {
    reactants: ['Cu', 'H₂SO₄'],
    type: 'Redox / Single Displacement',
    products: ['CuSO₄', 'SO₂↑', 'H₂O'],
    equation: 'Cu + 2H₂SO₄(conc) → CuSO₄ + SO₂↑ + 2H₂O',
    animation: 'vigorous_bubbles',
    safety: 'dangerous',
    explanation: {
      7: 'Copper reacts with concentrated sulfuric acid to form copper sulfate, sulfur dioxide gas, and water. Warning: SO₂ is toxic!',
      10: 'Cu + 2H₂SO₄ → CuSO₄ + SO₂↑ + 2H₂O. Copper is below hydrogen, so it cannot displace it. It reduces the sulfate instead.',
    },
    atomicChanges: { electron_transfer: true, from: 'Cu', to: 'S', electrons: 2 },
    requiresApparatus: true,
  },
  {
    reactants: ['Zn', 'H₂SO₄'],
    type: 'Single Displacement',
    products: ['ZnSO₄', 'H₂↑'],
    equation: 'Zn + H₂SO₄ → ZnSO₄ + H₂↑',
    animation: 'bubbles',
    safety: 'safe',
    explanation: {
      7: 'Zinc displaces hydrogen from sulfuric acid to form zinc sulfate and hydrogen gas.',
    },
    atomicChanges: { electron_transfer: true, from: 'Zn', to: 'H⁺', electrons: 2 },
    requiresApparatus: true,
  },
  {
    reactants: ['Mg', 'H₂SO₄'],
    type: 'Single Displacement',
    products: ['MgSO₄', 'H₂↑'],
    equation: 'Mg + H₂SO₄ → MgSO₄ + H₂↑',
    animation: 'vigorous_bubbles',
    safety: 'safe',
    explanation: {
      7: 'Magnesium reacts very vigorously with sulfuric acid, forming magnesium sulfate and hydrogen gas.',
    },
    atomicChanges: { electron_transfer: true, from: 'Mg', to: 'H⁺', electrons: 2 },
    requiresApparatus: true,
  },
  {
    reactants: ['Fe', 'H₂SO₄'],
    type: 'Single Displacement',
    products: ['FeSO₄', 'H₂↑'],
    equation: 'Fe + H₂SO₄ → FeSO₄ + H₂↑',
    animation: 'slow_bubbles',
    safety: 'safe',
    explanation: {
      7: 'Iron slowly displaces hydrogen from sulfuric acid, forming iron(II) sulfate (greenish salt) and hydrogen.',
    },
    atomicChanges: { electron_transfer: true, from: 'Fe', to: 'H⁺', electrons: 2 },
    requiresApparatus: true,
  },
  {
    reactants: ['Ca', 'HCl'],
    type: 'Single Displacement',
    products: ['CaCl₂', 'H₂↑'],
    equation: 'Ca + 2HCl → CaCl₂ + H₂↑',
    animation: 'vigorous_bubbles',
    safety: 'caution',
    explanation: {
      7: 'Calcium reacts extremely rapidly with hydrochloric acid to form calcium chloride and hydrogen.',
    },
    atomicChanges: { electron_transfer: true, from: 'Ca', to: 'H⁺', electrons: 2 },
    requiresApparatus: true,
  },
  {
    reactants: ['Ca', 'H₂SO₄'],
    type: 'Single Displacement',
    products: ['CaSO₄', 'H₂↑'],
    equation: 'Ca + H₂SO₄ → CaSO₄ + H₂↑',
    animation: 'bubbles',
    safety: 'caution',
    explanation: {
      7: 'Calcium reacts with sulfuric acid, but the reaction slows down because calcium sulfate is slightly insoluble and forms a coating.',
    },
    atomicChanges: { electron_transfer: true, from: 'Ca', to: 'H⁺', electrons: 2 },
    requiresApparatus: true,
  },
  {
    reactants: ['Al', 'H₂SO₄'],
    type: 'Single Displacement',
    products: ['Al₂(SO₄)₃', 'H₂↑'],
    equation: '2Al + 3H₂SO₄ → Al₂(SO₄)₃ + 3H₂↑',
    animation: 'bubbles',
    safety: 'safe',
    explanation: {
      7: 'Aluminum reacts with sulfuric acid to form aluminum sulfate and hydrogen gas.',
    },
    atomicChanges: { electron_transfer: true, from: 'Al', to: 'H⁺', electrons: 3 },
    requiresApparatus: true,
  },
  {
    reactants: ['Ag', 'H₂SO₄'],
    type: 'No Reaction',
    products: [],
    equation: 'Ag + H₂SO₄ → No Reaction',
    animation: 'none',
    safety: 'safe',
    explanation: { 10: 'Silver is a noble metal and does not react with dilute sulfuric acid.' },
    atomicChanges: null,
    requiresApparatus: true,
  },
  {
    reactants: ['Au', 'H₂SO₄'],
    type: 'No Reaction',
    products: [],
    equation: 'Au + H₂SO₄ → No Reaction',
    animation: 'none',
    safety: 'safe',
    explanation: { 10: 'Gold is extremely unreactive and does not react with sulfuric acid.' },
    atomicChanges: null,
    requiresApparatus: true,
  },
  {
    reactants: ['Na', 'HCl'],
    type: 'Single Displacement',
    products: ['NaCl', 'H₂↑'],
    equation: '2Na + 2HCl → 2NaCl + H₂↑',
    animation: 'explosion',
    safety: 'dangerous',
    kaboom: true,
    explanation: { 10: 'Sodium reacts explosively with acids! The hydrogen gas ignites instantly.' },
    atomicChanges: { electron_transfer: true, from: 'Na', to: 'H⁺', electrons: 1 },
    requiresApparatus: true,
  },
  {
    reactants: ['K', 'HCl'],
    type: 'Single Displacement',
    products: ['KCl', 'H₂↑'],
    equation: '2K + 2HCl → 2KCl + H₂↑',
    animation: 'explosion',
    safety: 'dangerous',
    kaboom: true,
    explanation: { 10: 'Potassium reacts explosively with acids, even more violently than sodium!' },
    atomicChanges: { electron_transfer: true, from: 'K', to: 'H⁺', electrons: 1 },
    requiresApparatus: true,
  },
  {
    reactants: ['Na', 'O₂'],
    type: 'Combustion',
    products: ['Na₂O'],
    equation: '4Na + O₂ → 2Na₂O',
    animation: 'fire',
    safety: 'caution',
    explanation: { 10: 'Sodium burns in oxygen with a bright yellow flame to form sodium oxide.' },
    atomicChanges: { electron_transfer: true, from: 'Na', to: 'O', electrons: 1 },
    requiresApparatus: false,
  },
  {
    reactants: ['K', 'O₂'],
    type: 'Combustion',
    products: ['K₂O'],
    equation: '4K + O₂ → 2K₂O',
    animation: 'fire',
    safety: 'caution',
    explanation: { 10: 'Potassium burns in oxygen with a lilac flame to form potassium oxide.' },
    atomicChanges: { electron_transfer: true, from: 'K', to: 'O', electrons: 1 },
    requiresApparatus: false,
  },
  {
    reactants: ['Zn', 'O₂'],
    type: 'Combustion',
    products: ['ZnO'],
    equation: '2Zn + O₂ → 2ZnO',
    animation: 'fire',
    safety: 'caution',
    explanation: { 10: 'Zinc burns in oxygen to form zinc oxide, which is yellow when hot and white when cold.' },
    atomicChanges: { electron_transfer: true, from: 'Zn', to: 'O', electrons: 2 },
    requiresApparatus: false,
  },
  {
    reactants: ['Fe', 'O₂'],
    type: 'Combustion',
    products: ['Fe₂O₃'],
    equation: '4Fe + 3O₂ → 2Fe₂O₃',
    animation: 'fire',
    safety: 'safe',
    explanation: { 10: 'Iron burns in oxygen with bright sparks to form iron(III) oxide.' },
    atomicChanges: { electron_transfer: true, from: 'Fe', to: 'O', electrons: 3 },
    requiresApparatus: false,
  },
  {
    reactants: ['Ca', 'O₂'],
    type: 'Combustion',
    products: ['CaO'],
    equation: '2Ca + O₂ → 2CaO',
    animation: 'fire',
    safety: 'caution',
    explanation: { 10: 'Calcium burns in oxygen with a brick-red flame to form calcium oxide (quicklime).' },
    atomicChanges: { electron_transfer: true, from: 'Ca', to: 'O', electrons: 2 },
    requiresApparatus: false,
  },
  {
    reactants: ['Cu', 'O₂'],
    type: 'Oxidation',
    products: ['CuO'],
    equation: '2Cu + O₂ → 2CuO',
    animation: 'heat_shimmer',
    safety: 'safe',
    explanation: { 10: 'Copper does not burn, but when heated in oxygen, it gets coated with black copper(II) oxide.' },
    atomicChanges: { electron_transfer: true, from: 'Cu', to: 'O', electrons: 2 },
    requiresApparatus: false,
  },
  {
    reactants: ['Al', 'O₂'],
    type: 'Combustion',
    products: ['Al₂O₃'],
    equation: '4Al + 3O₂ → 2Al₂O₃',
    animation: 'fire',
    safety: 'caution',
    explanation: { 10: 'Aluminum powder burns in oxygen with a brilliant white flame.' },
    atomicChanges: { electron_transfer: true, from: 'Al', to: 'O', electrons: 3 },
    requiresApparatus: false,
  },
  {
    reactants: ['S', 'O₂'],
    type: 'Combustion',
    products: ['SO₂↑'],
    equation: 'S + O₂ → SO₂↑',
    animation: 'fire',
    safety: 'dangerous',
    explanation: { 10: 'Sulfur burns with a blue flame to form toxic sulfur dioxide gas.' },
    atomicChanges: { electron_sharing: true },
    requiresApparatus: true,
  },
  {
    reactants: ['H₂', 'O₂'],
    type: 'Combustion',
    products: ['H₂O'],
    equation: '2H₂ + O₂ → 2H₂O',
    animation: 'explosion',
    safety: 'dangerous',
    kaboom: true,
    explanation: { 10: 'Hydrogen burns in oxygen with a squeaky pop or explosion, producing water vapor.' },
    atomicChanges: { electron_sharing: true },
    requiresApparatus: false,
  },
  {
    reactants: ['Na', 'Cl'],
    type: 'Synthesis',
    products: ['NaCl'],
    equation: '2Na + Cl₂ → 2NaCl',
    animation: 'fire',
    safety: 'dangerous',
    explanation: { 10: 'Sodium burns brightly in chlorine gas to form table salt!' },
    atomicChanges: { electron_transfer: true, from: 'Na', to: 'Cl', electrons: 1 },
    requiresApparatus: true,
  },
  {
    reactants: ['Fe', 'Cl'],
    type: 'Synthesis',
    products: ['FeCl₃'],
    equation: '2Fe + 3Cl₂ → 2FeCl₃',
    animation: 'heat_shimmer',
    safety: 'caution',
    explanation: { 10: 'Iron reacts with chlorine gas to form iron(III) chloride.' },
    atomicChanges: { electron_transfer: true, from: 'Fe', to: 'Cl', electrons: 3 },
    requiresApparatus: true,
  },
  {
    reactants: ['Al', 'NaOH'],
    type: 'Metal + Base',
    products: ['NaAlO₂', 'H₂↑'],
    equation: '2Al + 2NaOH + 2H₂O → 2NaAlO₂ + 3H₂↑',
    animation: 'vigorous_bubbles',
    safety: 'dangerous',
    explanation: { 10: 'Aluminum reacts with strong bases like NaOH to form sodium aluminate and hydrogen gas.' },
    atomicChanges: null,
    requiresApparatus: true,
  },
  {
    reactants: ['Zn', 'NaOH'],
    type: 'Metal + Base',
    products: ['Na₂ZnO₂', 'H₂↑'],
    equation: 'Zn + 2NaOH → Na₂ZnO₂ + H₂↑',
    animation: 'bubbles',
    safety: 'caution',
    explanation: { 10: 'Zinc reacts with sodium hydroxide upon heating to form sodium zincate and hydrogen.' },
    atomicChanges: null,
    requiresApparatus: true,
  },
  {
    reactants: ['HCl', 'KOH'],
    type: 'Neutralization',
    products: ['KCl', 'H₂O'],
    equation: 'HCl + KOH → KCl + H₂O',
    animation: 'heat_shimmer',
    safety: 'safe',
    explanation: { 10: 'Hydrochloric acid neutralizes potassium hydroxide to make potassium chloride and water.' },
    atomicChanges: { bond_formation: true },
    requiresApparatus: true,
  },
  {
    reactants: ['HCl', 'Ca(OH)₂'],
    type: 'Neutralization',
    products: ['CaCl₂', 'H₂O'],
    equation: '2HCl + Ca(OH)₂ → CaCl₂ + 2H₂O',
    animation: 'heat_shimmer',
    safety: 'safe',
    explanation: { 10: 'Hydrochloric acid neutralizes calcium hydroxide to make calcium chloride and water.' },
    atomicChanges: { bond_formation: true },
    requiresApparatus: true,
  },
  {
    reactants: ['H₂SO₄', 'Ca(OH)₂'],
    type: 'Neutralization',
    products: ['CaSO₄', 'H₂O'],
    equation: 'H₂SO₄ + Ca(OH)₂ → CaSO₄ + 2H₂O',
    animation: 'heat_shimmer',
    safety: 'safe',
    explanation: { 10: 'Sulfuric acid neutralizes calcium hydroxide, but insoluble calcium sulfate forms.' },
    atomicChanges: { bond_formation: true },
    requiresApparatus: true,
  },
  {
    reactants: ['Mg', 'H₂O'],
    type: 'Metal + Water',
    products: ['Mg(OH)₂', 'H₂↑'],
    equation: 'Mg + 2H₂O(hot) → Mg(OH)₂ + H₂↑',
    animation: 'bubbles',
    safety: 'safe',
    explanation: { 10: 'Magnesium reacts very slowly with cold water, but reacts with hot water or steam to form magnesium hydroxide and hydrogen.' },
    atomicChanges: { electron_transfer: true, from: 'Mg', to: 'H₂O', electrons: 2 },
    requiresApparatus: true,
  }
,

  {
    "reactants": [
      "Na",
      "HNO₃"
    ],
    "type": "Single Displacement",
    "products": [
      "NaNO₃",
      "H₂↑"
    ],
    "equation": "Na + HNO₃ → NaNO₃ + H₂↑",
    "animation": "bubbles",
    "safety": "safe",
    "explanation": {
      "10": "Na reacts with HNO₃ to form NaNO₃ and hydrogen gas."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Na",
      "to": "H⁺",
      "electrons": 1
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Na",
      "CH₃COOH"
    ],
    "type": "Single Displacement",
    "products": [
      "CH₃COONa",
      "H₂↑"
    ],
    "equation": "Na + CH₃COOH → CH₃COONa + H₂↑",
    "animation": "bubbles",
    "safety": "safe",
    "explanation": {
      "10": "Na reacts with CH₃COOH to form CH₃COONa and hydrogen gas."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Na",
      "to": "H⁺",
      "electrons": 1
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "K",
      "HNO₃"
    ],
    "type": "Single Displacement",
    "products": [
      "KNO₃",
      "H₂↑"
    ],
    "equation": "K + HNO₃ → KNO₃ + H₂↑",
    "animation": "bubbles",
    "safety": "safe",
    "explanation": {
      "10": "K reacts with HNO₃ to form KNO₃ and hydrogen gas."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "K",
      "to": "H⁺",
      "electrons": 1
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "K",
      "CH₃COOH"
    ],
    "type": "Single Displacement",
    "products": [
      "CH₃COOK",
      "H₂↑"
    ],
    "equation": "K + CH₃COOH → CH₃COOK + H₂↑",
    "animation": "bubbles",
    "safety": "safe",
    "explanation": {
      "10": "K reacts with CH₃COOH to form CH₃COOK and hydrogen gas."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "K",
      "to": "H⁺",
      "electrons": 1
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Fe",
      "HNO₃"
    ],
    "type": "Single Displacement",
    "products": [
      "Fe(NO₃)₂",
      "H₂↑"
    ],
    "equation": "Fe + HNO₃ → Fe(NO₃)₂ + H₂↑",
    "animation": "bubbles",
    "safety": "safe",
    "explanation": {
      "10": "Fe reacts with HNO₃ to form Fe(NO₃)₂ and hydrogen gas."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Fe",
      "to": "H⁺",
      "electrons": 2
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Fe",
      "CH₃COOH"
    ],
    "type": "Single Displacement",
    "products": [
      "(CH₃COO)₂Fe",
      "H₂↑"
    ],
    "equation": "Fe + CH₃COOH → (CH₃COO)₂Fe + H₂↑",
    "animation": "bubbles",
    "safety": "safe",
    "explanation": {
      "10": "Fe reacts with CH₃COOH to form (CH₃COO)₂Fe and hydrogen gas."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Fe",
      "to": "H⁺",
      "electrons": 2
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Zn",
      "HNO₃"
    ],
    "type": "Single Displacement",
    "products": [
      "Zn(NO₃)₂",
      "H₂↑"
    ],
    "equation": "Zn + HNO₃ → Zn(NO₃)₂ + H₂↑",
    "animation": "bubbles",
    "safety": "safe",
    "explanation": {
      "10": "Zn reacts with HNO₃ to form Zn(NO₃)₂ and hydrogen gas."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Zn",
      "to": "H⁺",
      "electrons": 2
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Zn",
      "CH₃COOH"
    ],
    "type": "Single Displacement",
    "products": [
      "(CH₃COO)₂Zn",
      "H₂↑"
    ],
    "equation": "Zn + CH₃COOH → (CH₃COO)₂Zn + H₂↑",
    "animation": "bubbles",
    "safety": "safe",
    "explanation": {
      "10": "Zn reacts with CH₃COOH to form (CH₃COO)₂Zn and hydrogen gas."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Zn",
      "to": "H⁺",
      "electrons": 2
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Mg",
      "HNO₃"
    ],
    "type": "Single Displacement",
    "products": [
      "Mg(NO₃)₂",
      "H₂↑"
    ],
    "equation": "Mg + HNO₃ → Mg(NO₃)₂ + H₂↑",
    "animation": "bubbles",
    "safety": "safe",
    "explanation": {
      "10": "Mg reacts with HNO₃ to form Mg(NO₃)₂ and hydrogen gas."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Mg",
      "to": "H⁺",
      "electrons": 2
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Mg",
      "CH₃COOH"
    ],
    "type": "Single Displacement",
    "products": [
      "(CH₃COO)₂Mg",
      "H₂↑"
    ],
    "equation": "Mg + CH₃COOH → (CH₃COO)₂Mg + H₂↑",
    "animation": "bubbles",
    "safety": "safe",
    "explanation": {
      "10": "Mg reacts with CH₃COOH to form (CH₃COO)₂Mg and hydrogen gas."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Mg",
      "to": "H⁺",
      "electrons": 2
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Ca",
      "HNO₃"
    ],
    "type": "Single Displacement",
    "products": [
      "Ca(NO₃)₂",
      "H₂↑"
    ],
    "equation": "Ca + HNO₃ → Ca(NO₃)₂ + H₂↑",
    "animation": "bubbles",
    "safety": "safe",
    "explanation": {
      "10": "Ca reacts with HNO₃ to form Ca(NO₃)₂ and hydrogen gas."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Ca",
      "to": "H⁺",
      "electrons": 2
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Ca",
      "CH₃COOH"
    ],
    "type": "Single Displacement",
    "products": [
      "(CH₃COO)₂Ca",
      "H₂↑"
    ],
    "equation": "Ca + CH₃COOH → (CH₃COO)₂Ca + H₂↑",
    "animation": "bubbles",
    "safety": "safe",
    "explanation": {
      "10": "Ca reacts with CH₃COOH to form (CH₃COO)₂Ca and hydrogen gas."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Ca",
      "to": "H⁺",
      "electrons": 2
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Cu",
      "CH₃COOH"
    ],
    "type": "No Reaction",
    "products": [],
    "equation": "Cu + CH₃COOH → No Reaction",
    "animation": "none",
    "safety": "safe",
    "explanation": {
      "10": "Cu is too unreactive to displace hydrogen from weak acetic acid."
    },
    "atomicChanges": null,
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Al",
      "HNO₃"
    ],
    "type": "Single Displacement",
    "products": [
      "Al(NO₃)₃",
      "H₂↑"
    ],
    "equation": "Al + HNO₃ → Al(NO₃)₃ + H₂↑",
    "animation": "bubbles",
    "safety": "safe",
    "explanation": {
      "10": "Al reacts with HNO₃ to form Al(NO₃)₃ and hydrogen gas."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Al",
      "to": "H⁺",
      "electrons": 3
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Al",
      "CH₃COOH"
    ],
    "type": "Single Displacement",
    "products": [
      "(CH₃COO)₃Al",
      "H₂↑"
    ],
    "equation": "Al + CH₃COOH → (CH₃COO)₃Al + H₂↑",
    "animation": "bubbles",
    "safety": "safe",
    "explanation": {
      "10": "Al reacts with CH₃COOH to form (CH₃COO)₃Al and hydrogen gas."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Al",
      "to": "H⁺",
      "electrons": 3
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Au",
      "CH₃COOH"
    ],
    "type": "No Reaction",
    "products": [],
    "equation": "Au + CH₃COOH → No Reaction",
    "animation": "none",
    "safety": "safe",
    "explanation": {
      "10": "Au is too unreactive to displace hydrogen from weak acetic acid."
    },
    "atomicChanges": null,
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Ag",
      "CH₃COOH"
    ],
    "type": "No Reaction",
    "products": [],
    "equation": "Ag + CH₃COOH → No Reaction",
    "animation": "none",
    "safety": "safe",
    "explanation": {
      "10": "Ag is too unreactive to displace hydrogen from weak acetic acid."
    },
    "atomicChanges": null,
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Na",
      "Br"
    ],
    "type": "Synthesis",
    "products": [
      "NaBr"
    ],
    "equation": "Na + Br₂ → NaBr",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "Na reacts directly with Br to form NaBr."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Na",
      "to": "Br",
      "electrons": 1
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Na",
      "I"
    ],
    "type": "Synthesis",
    "products": [
      "NaI"
    ],
    "equation": "Na + I₂ → NaI",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "Na reacts directly with I to form NaI."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Na",
      "to": "I",
      "electrons": 1
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Na",
      "Cl"
    ],
    "type": "Synthesis",
    "products": [
      "NaCl"
    ],
    "equation": "Na + Cl₂ → NaCl",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "Na reacts directly with Cl to form NaCl."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Na",
      "to": "Cl",
      "electrons": 1
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "K",
      "Br"
    ],
    "type": "Synthesis",
    "products": [
      "KBr"
    ],
    "equation": "K + Br₂ → KBr",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "K reacts directly with Br to form KBr."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "K",
      "to": "Br",
      "electrons": 1
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "K",
      "I"
    ],
    "type": "Synthesis",
    "products": [
      "KI"
    ],
    "equation": "K + I₂ → KI",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "K reacts directly with I to form KI."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "K",
      "to": "I",
      "electrons": 1
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "K",
      "Cl"
    ],
    "type": "Synthesis",
    "products": [
      "KCl"
    ],
    "equation": "K + Cl₂ → KCl",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "K reacts directly with Cl to form KCl."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "K",
      "to": "Cl",
      "electrons": 1
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Fe",
      "Br"
    ],
    "type": "Synthesis",
    "products": [
      "FeBr₂"
    ],
    "equation": "Fe + Br₂ → FeBr₂",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "Fe reacts directly with Br to form FeBr₂."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Fe",
      "to": "Br",
      "electrons": 2
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Fe",
      "I"
    ],
    "type": "Synthesis",
    "products": [
      "FeI₂"
    ],
    "equation": "Fe + I₂ → FeI₂",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "Fe reacts directly with I to form FeI₂."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Fe",
      "to": "I",
      "electrons": 2
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Fe",
      "Cl"
    ],
    "type": "Synthesis",
    "products": [
      "FeCl₂"
    ],
    "equation": "Fe + Cl₂ → FeCl₂",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "Fe reacts directly with Cl to form FeCl₂."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Fe",
      "to": "Cl",
      "electrons": 2
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Zn",
      "Br"
    ],
    "type": "Synthesis",
    "products": [
      "ZnBr₂"
    ],
    "equation": "Zn + Br₂ → ZnBr₂",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "Zn reacts directly with Br to form ZnBr₂."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Zn",
      "to": "Br",
      "electrons": 2
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Zn",
      "I"
    ],
    "type": "Synthesis",
    "products": [
      "ZnI₂"
    ],
    "equation": "Zn + I₂ → ZnI₂",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "Zn reacts directly with I to form ZnI₂."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Zn",
      "to": "I",
      "electrons": 2
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Zn",
      "Cl"
    ],
    "type": "Synthesis",
    "products": [
      "ZnCl₂"
    ],
    "equation": "Zn + Cl₂ → ZnCl₂",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "Zn reacts directly with Cl to form ZnCl₂."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Zn",
      "to": "Cl",
      "electrons": 2
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Mg",
      "Br"
    ],
    "type": "Synthesis",
    "products": [
      "MgBr₂"
    ],
    "equation": "Mg + Br₂ → MgBr₂",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "Mg reacts directly with Br to form MgBr₂."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Mg",
      "to": "Br",
      "electrons": 2
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Mg",
      "I"
    ],
    "type": "Synthesis",
    "products": [
      "MgI₂"
    ],
    "equation": "Mg + I₂ → MgI₂",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "Mg reacts directly with I to form MgI₂."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Mg",
      "to": "I",
      "electrons": 2
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Mg",
      "Cl"
    ],
    "type": "Synthesis",
    "products": [
      "MgCl₂"
    ],
    "equation": "Mg + Cl₂ → MgCl₂",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "Mg reacts directly with Cl to form MgCl₂."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Mg",
      "to": "Cl",
      "electrons": 2
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Ca",
      "Br"
    ],
    "type": "Synthesis",
    "products": [
      "CaBr₂"
    ],
    "equation": "Ca + Br₂ → CaBr₂",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "Ca reacts directly with Br to form CaBr₂."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Ca",
      "to": "Br",
      "electrons": 2
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Ca",
      "I"
    ],
    "type": "Synthesis",
    "products": [
      "CaI₂"
    ],
    "equation": "Ca + I₂ → CaI₂",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "Ca reacts directly with I to form CaI₂."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Ca",
      "to": "I",
      "electrons": 2
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Ca",
      "Cl"
    ],
    "type": "Synthesis",
    "products": [
      "CaCl₂"
    ],
    "equation": "Ca + Cl₂ → CaCl₂",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "Ca reacts directly with Cl to form CaCl₂."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Ca",
      "to": "Cl",
      "electrons": 2
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Cu",
      "Br"
    ],
    "type": "Synthesis",
    "products": [
      "CuBr₂"
    ],
    "equation": "Cu + Br₂ → CuBr₂",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "Cu reacts directly with Br to form CuBr₂."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Cu",
      "to": "Br",
      "electrons": 2
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Cu",
      "I"
    ],
    "type": "Synthesis",
    "products": [
      "CuI₂"
    ],
    "equation": "Cu + I₂ → CuI₂",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "Cu reacts directly with I to form CuI₂."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Cu",
      "to": "I",
      "electrons": 2
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Cu",
      "Cl"
    ],
    "type": "Synthesis",
    "products": [
      "CuCl₂"
    ],
    "equation": "Cu + Cl₂ → CuCl₂",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "Cu reacts directly with Cl to form CuCl₂."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Cu",
      "to": "Cl",
      "electrons": 2
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Al",
      "Br"
    ],
    "type": "Synthesis",
    "products": [
      "AlBr₃"
    ],
    "equation": "Al + Br₂ → AlBr₃",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "Al reacts directly with Br to form AlBr₃."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Al",
      "to": "Br",
      "electrons": 3
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Al",
      "I"
    ],
    "type": "Synthesis",
    "products": [
      "AlI₃"
    ],
    "equation": "Al + I₂ → AlI₃",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "Al reacts directly with I to form AlI₃."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Al",
      "to": "I",
      "electrons": 3
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Al",
      "Cl"
    ],
    "type": "Synthesis",
    "products": [
      "AlCl₃"
    ],
    "equation": "Al + Cl₂ → AlCl₃",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "Al reacts directly with Cl to form AlCl₃."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Al",
      "to": "Cl",
      "electrons": 3
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Au",
      "Br"
    ],
    "type": "Synthesis",
    "products": [
      "AuBr₃"
    ],
    "equation": "Au + Br₂ → AuBr₃",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "Au reacts directly with Br to form AuBr₃."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Au",
      "to": "Br",
      "electrons": 3
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Au",
      "I"
    ],
    "type": "Synthesis",
    "products": [
      "AuI₃"
    ],
    "equation": "Au + I₂ → AuI₃",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "Au reacts directly with I to form AuI₃."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Au",
      "to": "I",
      "electrons": 3
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Au",
      "Cl"
    ],
    "type": "Synthesis",
    "products": [
      "AuCl₃"
    ],
    "equation": "Au + Cl₂ → AuCl₃",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "Au reacts directly with Cl to form AuCl₃."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Au",
      "to": "Cl",
      "electrons": 3
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Ag",
      "Br"
    ],
    "type": "Synthesis",
    "products": [
      "AgBr"
    ],
    "equation": "Ag + Br₂ → AgBr",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "Ag reacts directly with Br to form AgBr."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Ag",
      "to": "Br",
      "electrons": 1
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Ag",
      "I"
    ],
    "type": "Synthesis",
    "products": [
      "AgI"
    ],
    "equation": "Ag + I₂ → AgI",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "Ag reacts directly with I to form AgI."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Ag",
      "to": "I",
      "electrons": 1
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Ag",
      "Cl"
    ],
    "type": "Synthesis",
    "products": [
      "AgCl"
    ],
    "equation": "Ag + Cl₂ → AgCl",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "Ag reacts directly with Cl to form AgCl."
    },
    "atomicChanges": {
      "electron_transfer": true,
      "from": "Ag",
      "to": "Cl",
      "electrons": 1
    },
    "requiresApparatus": true
  }
,

  {
    "reactants": [
      "NH₃",
      "HCl"
    ],
    "type": "Synthesis / Neutralization",
    "products": [
      "NH₄Cl"
    ],
    "equation": "NH₃ + HCl → NH₄Cl",
    "animation": "heat_shimmer",
    "safety": "caution",
    "explanation": {
      "10": "Ammonia gas reacts with hydrogen chloride to form a thick white smoke of solid ammonium chloride."
    },
    "atomicChanges": {
      "bond_formation": true
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "NH₃",
      "HNO₃"
    ],
    "type": "Neutralization",
    "products": [
      "NH₄NO₃"
    ],
    "equation": "NH₃ + HNO₃ → NH₄NO₃",
    "animation": "heat_shimmer",
    "safety": "safe",
    "explanation": {
      "10": "Ammonia neutralizes nitric acid to form ammonium nitrate, a common fertilizer."
    },
    "atomicChanges": {
      "bond_formation": true
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "NH₃",
      "H₂SO₄"
    ],
    "type": "Neutralization",
    "products": [
      "(NH₄)₂SO₄"
    ],
    "equation": "2NH₃ + H₂SO₄ → (NH₄)₂SO₄",
    "animation": "heat_shimmer",
    "safety": "safe",
    "explanation": {
      "10": "Ammonia neutralizes sulfuric acid to form ammonium sulfate."
    },
    "atomicChanges": {
      "bond_formation": true
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "NH₃",
      "CH₃COOH"
    ],
    "type": "Neutralization",
    "products": [
      "CH₃COONH₄"
    ],
    "equation": "NH₃ + CH₃COOH → CH₃COONH₄",
    "animation": "heat_shimmer",
    "safety": "safe",
    "explanation": {
      "10": "Ammonia neutralizes acetic acid to form ammonium acetate."
    },
    "atomicChanges": {
      "bond_formation": true
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "P",
      "O₂"
    ],
    "type": "Combustion",
    "products": [
      "P₄O₁₀"
    ],
    "equation": "4P + 5O₂ → P₄O₁₀",
    "animation": "fire",
    "safety": "dangerous",
    "explanation": {
      "10": "Phosphorus burns brilliantly in oxygen to form thick white clouds of phosphorus pentoxide."
    },
    "atomicChanges": {
      "electron_sharing": true
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Si",
      "O₂"
    ],
    "type": "Combustion",
    "products": [
      "SiO₂"
    ],
    "equation": "Si + O₂ → SiO₂",
    "animation": "heat_shimmer",
    "safety": "safe",
    "explanation": {
      "10": "Silicon oxidizes slowly at high temperatures to form silicon dioxide (sand/quartz)."
    },
    "atomicChanges": {
      "electron_sharing": true
    },
    "requiresApparatus": false
  },
  {
    "reactants": [
      "C",
      "S"
    ],
    "type": "Synthesis",
    "products": [
      "CS₂"
    ],
    "equation": "C + 2S → CS₂",
    "animation": "heat_shimmer",
    "safety": "dangerous",
    "explanation": {
      "10": "Carbon reacts with sulfur vapor at high temperatures to form highly flammable carbon disulfide."
    },
    "atomicChanges": {
      "electron_sharing": true
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "H₂",
      "Cl"
    ],
    "type": "Synthesis",
    "products": [
      "HCl"
    ],
    "equation": "H₂ + Cl₂ → 2HCl",
    "animation": "explosion",
    "safety": "dangerous",
    "kaboom": true,
    "explanation": {
      "10": "Hydrogen and chlorine gases react explosively in sunlight to form hydrogen chloride."
    },
    "atomicChanges": {
      "electron_sharing": true
    },
    "requiresApparatus": false
  },
  {
    "reactants": [
      "H₂",
      "Br"
    ],
    "type": "Synthesis",
    "products": [
      "HBr"
    ],
    "equation": "H₂ + Br₂ → 2HBr",
    "animation": "fire",
    "safety": "caution",
    "explanation": {
      "10": "Hydrogen reacts with bromine vapor to form hydrogen bromide."
    },
    "atomicChanges": {
      "electron_sharing": true
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "H₂",
      "I"
    ],
    "type": "Synthesis",
    "products": [
      "HI"
    ],
    "equation": "H₂ + I₂ → 2HI",
    "animation": "heat_shimmer",
    "safety": "safe",
    "explanation": {
      "10": "Hydrogen and iodine react reversibly when heated to form hydrogen iodide."
    },
    "atomicChanges": {
      "electron_sharing": true
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "N₂",
      "H₂"
    ],
    "type": "Synthesis",
    "products": [
      "NH₃"
    ],
    "equation": "N₂ + 3H₂ ⇌ 2NH₃ (Fe catalyst)",
    "animation": "heat_shimmer",
    "safety": "safe",
    "explanation": {
      "10": "Nitrogen and hydrogen combine under high pressure with an iron catalyst to make ammonia (Haber process)."
    },
    "atomicChanges": {
      "electron_sharing": true
    },
    "requiresApparatus": true
  }
,

  {
    "reactants": [
      "NaOH",
      "HNO₃"
    ],
    "type": "Neutralization",
    "products": [
      "NaNO₃",
      "H₂O"
    ],
    "equation": "NaOH + HNO₃ → NaNO₃ + H₂O",
    "animation": "heat_shimmer",
    "safety": "safe",
    "explanation": {
      "10": "Nitric acid and sodium hydroxide neutralize to form sodium nitrate and water."
    },
    "atomicChanges": {
      "bond_formation": true
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "KOH",
      "HNO₃"
    ],
    "type": "Neutralization",
    "products": [
      "KNO₃",
      "H₂O"
    ],
    "equation": "KOH + HNO₃ → KNO₃ + H₂O",
    "animation": "heat_shimmer",
    "safety": "safe",
    "explanation": {
      "10": "Nitric acid and potassium hydroxide neutralize to form potassium nitrate and water."
    },
    "atomicChanges": {
      "bond_formation": true
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Ca(OH)₂",
      "HNO₃"
    ],
    "type": "Neutralization",
    "products": [
      "Ca(NO₃)₂",
      "H₂O"
    ],
    "equation": "Ca(OH)₂ + 2HNO₃ → Ca(NO₃)₂ + 2H₂O",
    "animation": "heat_shimmer",
    "safety": "safe",
    "explanation": {
      "10": "Nitric acid and calcium hydroxide neutralize to form calcium nitrate and water."
    },
    "atomicChanges": {
      "bond_formation": true
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "NaOH",
      "CH₃COOH"
    ],
    "type": "Neutralization",
    "products": [
      "CH₃COONa",
      "H₂O"
    ],
    "equation": "NaOH + CH₃COOH → CH₃COONa + H₂O",
    "animation": "heat_shimmer",
    "safety": "safe",
    "explanation": {
      "10": "Acetic acid neutralizes sodium hydroxide to form sodium acetate."
    },
    "atomicChanges": {
      "bond_formation": true
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "KOH",
      "CH₃COOH"
    ],
    "type": "Neutralization",
    "products": [
      "CH₃COOK",
      "H₂O"
    ],
    "equation": "KOH + CH₃COOH → CH₃COOK + H₂O",
    "animation": "heat_shimmer",
    "safety": "safe",
    "explanation": {
      "10": "Acetic acid neutralizes potassium hydroxide to form potassium acetate."
    },
    "atomicChanges": {
      "bond_formation": true
    },
    "requiresApparatus": true
  },
  {
    "reactants": [
      "Ca(OH)₂",
      "CH₃COOH"
    ],
    "type": "Neutralization",
    "products": [
      "(CH₃COO)₂Ca",
      "H₂O"
    ],
    "equation": "Ca(OH)₂ + 2CH₃COOH → (CH₃COO)₂Ca + 2H₂O",
    "animation": "heat_shimmer",
    "safety": "safe",
    "explanation": {
      "10": "Acetic acid neutralizes calcium hydroxide to form calcium acetate."
    },
    "atomicChanges": {
      "bond_formation": true
    },
    "requiresApparatus": true
  }
];

// Symbol to name mapping for lookup
const SYMBOL_MAP = {
  'Na': 'Sodium', 'K': 'Potassium', 'Fe': 'Iron', 'Zn': 'Zinc',
  'Mg': 'Magnesium', 'Ca': 'Calcium', 'Cu': 'Copper', 'Al': 'Aluminum',
  'Au': 'Gold', 'Ag': 'Silver', 'S': 'Sulfur', 'C': 'Carbon',
  'Cl': 'Chlorine', 'O₂': 'Oxygen', 'N₂': 'Nitrogen', 'P': 'Phosphorus',
  'Si': 'Silicon', 'Br': 'Bromine', 'I': 'Iodine', 'H₂': 'Hydrogen',
  'H₂O': 'Water',
};

const PRODUCT_MAP = {
  'ZnCl₂': { name: 'Zinc Chloride', category: 'salt' },
  'MgCl₂': { name: 'Magnesium Chloride', category: 'salt' },
  'FeCl₂': { name: 'Iron(II) Chloride', category: 'salt' },
  'NaCl':  { name: 'Sodium Chloride', category: 'salt' },
  'K₂SO₄': { name: 'Potassium Sulfate', category: 'salt' },
  'Na₂SO₄':{ name: 'Sodium Sulfate', category: 'salt' },
  'AlCl₃': { name: 'Aluminum Chloride', category: 'salt' },
  'H₂↑':   { name: 'Hydrogen Gas', category: 'gas' },
  'NaOH':  { name: 'Sodium Hydroxide', category: 'base' },
  'KOH':   { name: 'Potassium Hydroxide', category: 'base' },
  'Ca(OH)₂': { name: 'Calcium Hydroxide', category: 'base' },
  'H₂O':   { name: 'Water', category: 'liquid' },
  'MgO':   { name: 'Magnesium Oxide', category: 'salt' },
  'CO₂':   { name: 'Carbon Dioxide', category: 'gas' },
  'CuSO₄': { name: 'Copper(II) Sulfate', category: 'salt' },
  'SO₂↑':  { name: 'Sulfur Dioxide Gas', category: 'gas' },
  'ZnSO₄': { name: 'Zinc Sulfate', category: 'salt' },
  'MgSO₄': { name: 'Magnesium Sulfate', category: 'salt' },
  'FeSO₄': { name: 'Iron(II) Sulfate', category: 'salt' },
  'CaCl₂': { name: 'Calcium Chloride', category: 'salt' },
  'CaSO₄': { name: 'Calcium Sulfate', category: 'salt' },
  'Al₂(SO₄)₃': { name: 'Aluminum Sulfate', category: 'salt' },
  'Na₂O':  { name: 'Sodium Oxide', category: 'salt' },
  'K₂O':   { name: 'Potassium Oxide', category: 'salt' },
  'ZnO':   { name: 'Zinc Oxide', category: 'salt' },
  'Fe₂O₃': { name: 'Iron(III) Oxide', category: 'salt' },
  'CaO':   { name: 'Calcium Oxide', category: 'salt' },
  'CuO':   { name: 'Copper(II) Oxide', category: 'salt' },
  'Al₂O₃': { name: 'Aluminum Oxide', category: 'salt' },
  'P₄O₁₀': { name: 'Phosphorus Pentoxide', category: 'salt' },
  'KCl':   { name: 'Potassium Chloride', category: 'salt' },
  'FeCl₃': { name: 'Iron(III) Chloride', category: 'salt' },
  'NaAlO₂': { name: 'Sodium Aluminate', category: 'salt' },
  'Na₂ZnO₂': { name: 'Sodium Zincate', category: 'salt' },
  'Mg(OH)₂': { name: 'Magnesium Hydroxide', category: 'base' },

  "NaNO₃": {
    "name": "Na Nitrate",
    "category": "salt"
  },
  "CH₃COONa": {
    "name": "Na Acetate",
    "category": "salt"
  },
  "KNO₃": {
    "name": "K Nitrate",
    "category": "salt"
  },
  "CH₃COOK": {
    "name": "K Acetate",
    "category": "salt"
  },
  "Fe(NO₃)₂": {
    "name": "Fe Nitrate",
    "category": "salt"
  },
  "(CH₃COO)₂Fe": {
    "name": "Fe Acetate",
    "category": "salt"
  },
  "Zn(NO₃)₂": {
    "name": "Zn Nitrate",
    "category": "salt"
  },
  "(CH₃COO)₂Zn": {
    "name": "Zn Acetate",
    "category": "salt"
  },
  "Mg(NO₃)₂": {
    "name": "Mg Nitrate",
    "category": "salt"
  },
  "(CH₃COO)₂Mg": {
    "name": "Mg Acetate",
    "category": "salt"
  },
  "Ca(NO₃)₂": {
    "name": "Ca Nitrate",
    "category": "salt"
  },
  "(CH₃COO)₂Ca": {
    "name": "Ca Acetate",
    "category": "salt"
  },
  "Al(NO₃)₃": {
    "name": "Al Nitrate",
    "category": "salt"
  },
  "(CH₃COO)₃Al": {
    "name": "Al Acetate",
    "category": "salt"
  },
  "NaBr": {
    "name": "Na Bromide",
    "category": "salt"
  },
  "NaI": {
    "name": "Na Iodide",
    "category": "salt"
  },
  "NaCl": {
    "name": "Na Chloride",
    "category": "salt"
  },
  "KBr": {
    "name": "K Bromide",
    "category": "salt"
  },
  "KI": {
    "name": "K Iodide",
    "category": "salt"
  },
  "KCl": {
    "name": "K Chloride",
    "category": "salt"
  },
  "FeBr₂": {
    "name": "Fe Bromide",
    "category": "salt"
  },
  "FeI₂": {
    "name": "Fe Iodide",
    "category": "salt"
  },
  "FeCl₂": {
    "name": "Fe Chloride",
    "category": "salt"
  },
  "ZnBr₂": {
    "name": "Zn Bromide",
    "category": "salt"
  },
  "ZnI₂": {
    "name": "Zn Iodide",
    "category": "salt"
  },
  "ZnCl₂": {
    "name": "Zn Chloride",
    "category": "salt"
  },
  "MgBr₂": {
    "name": "Mg Bromide",
    "category": "salt"
  },
  "MgI₂": {
    "name": "Mg Iodide",
    "category": "salt"
  },
  "MgCl₂": {
    "name": "Mg Chloride",
    "category": "salt"
  },
  "CaBr₂": {
    "name": "Ca Bromide",
    "category": "salt"
  },
  "CaI₂": {
    "name": "Ca Iodide",
    "category": "salt"
  },
  "CaCl₂": {
    "name": "Ca Chloride",
    "category": "salt"
  },
  "CuBr₂": {
    "name": "Cu Bromide",
    "category": "salt"
  },
  "CuI₂": {
    "name": "Cu Iodide",
    "category": "salt"
  },
  "CuCl₂": {
    "name": "Cu Chloride",
    "category": "salt"
  },
  "AlBr₃": {
    "name": "Al Bromide",
    "category": "salt"
  },
  "AlI₃": {
    "name": "Al Iodide",
    "category": "salt"
  },
  "AlCl₃": {
    "name": "Al Chloride",
    "category": "salt"
  },
  "AuBr₃": {
    "name": "Au Bromide",
    "category": "salt"
  },
  "AuI₃": {
    "name": "Au Iodide",
    "category": "salt"
  },
  "AuCl₃": {
    "name": "Au Chloride",
    "category": "salt"
  },
  "AgBr": {
    "name": "Ag Bromide",
    "category": "salt"
  },
  "AgI": {
    "name": "Ag Iodide",
    "category": "salt"
  },
  "AgCl": {
    "name": "Ag Chloride",
    "category": "salt"
  }
,

  "NH₄Cl": {
    "name": "Ammonium Chloride",
    "category": "salt"
  },
  "NH₄NO₃": {
    "name": "Ammonium Nitrate",
    "category": "salt"
  },
  "(NH₄)₂SO₄": {
    "name": "Ammonium Sulfate",
    "category": "salt"
  },
  "CH₃COONH₄": {
    "name": "Ammonium Acetate",
    "category": "salt"
  },
  "P₄O₁₀": {
    "name": "Phosphorus Pentoxide",
    "category": "salt"
  },
  "SiO₂": {
    "name": "Silicon Dioxide",
    "category": "salt"
  },
  "CS₂": {
    "name": "Carbon Disulfide",
    "category": "liquid"
  },
  "NH₃": {
    "name": "Ammonia",
    "category": "base"
  },
  "HBr": {
    "name": "Hydrogen Bromide",
    "category": "acid"
  },
  "HI": {
    "name": "Hydrogen Iodide",
    "category": "acid"
  }
,

  "NaNO₃": {
    "name": "Sodium Nitrate",
    "category": "salt"
  },
  "KNO₃": {
    "name": "Potassium Nitrate",
    "category": "salt"
  },
  "Ca(NO₃)₂": {
    "name": "Calcium Nitrate",
    "category": "salt"
  },
  "CH₃COONa": {
    "name": "Sodium Acetate",
    "category": "salt"
  },
  "CH₃COOK": {
    "name": "Potassium Acetate",
    "category": "salt"
  },
  "(CH₃COO)₂Ca": {
    "name": "Calcium Acetate",
    "category": "salt"
  },
  "CaCl₂": {
    "name": "Calcium Chloride",
    "category": "salt"
  },
  "CaSO₄": {
    "name": "Calcium Sulfate",
    "category": "salt"
  }
};

export function checkReaction(items, classLevel = 10) {
  // Extract chemicals from bench items
  const chemicals = items.filter(i => i.category !== 'apparatus');

  const apparatus = items
    .filter(i => i.category === 'apparatus')
    .map(i => i.name);

  const hasApparatus = apparatus.length > 0;

  let lastUnreactivePair = null;

  // Check each pair of chemicals
  for (let i = 0; i < chemicals.length; i++) {
    for (let j = i + 1; j < chemicals.length; j++) {
      const chem1 = chemicals[i];
      const chem2 = chemicals[j];
      
      // Skip evaluation if both are products of a previous reaction
      if (chem1.isProduct && chem2.isProduct) {
        continue;
      }

      const pair = [chem1.symbol, chem2.symbol];
      let matched = false;

      for (const reaction of REACTIONS) {
        const match =
          (reaction.reactants.includes(pair[0]) && reaction.reactants.includes(pair[1])) ||
          (reaction.reactants.includes(pair[1]) && reaction.reactants.includes(pair[0]));

        if (match) {
          matched = true;
          // Calculate midpoint for product placement
          const cx = (chem1.x + chem2.x) / 2 || 150;
          const cy = (chem1.y + chem2.y) / 2 || 150;

          let detailedProducts = reaction.products.map((prodSymbol, idx) => {
            const mapped = PRODUCT_MAP[prodSymbol] || { name: prodSymbol, category: 'unknown' };
            return {
              symbol: prodSymbol,
              name: mapped.name,
              category: mapped.category,
              isProduct: true,
              x: cx + (idx * 40 - 20),
              y: cy + (idx * 20),
            };
          });

          // Class-based product filtering: Show only main product (index 0) for classes < 9
          if (classLevel < 9 && detailedProducts.length > 0) {
            detailedProducts = [detailedProducts[0]];
          }

          // Check if apparatus is needed
          const safetyWarning = reaction.requiresApparatus && !hasApparatus;
          let isKaboom = reaction.kaboom || false;
          if (isKaboom && hasApparatus) {
            isKaboom = false; // Contained explosion
          }

          // Get explanation for class level
          const explanationKeys = Object.keys(reaction.explanation).map(Number).sort((a, b) => a - b);
          let explanation = reaction.explanation[explanationKeys[0]];
          for (const key of explanationKeys) {
            if (classLevel >= key) explanation = reaction.explanation[key];
          }

          return {
            found: true,
            type: reaction.type,
            products: detailedProducts,
            reactantBenchIds: [chem1.benchId, chem2.benchId],
            equation: reaction.equation,
            ionicEquation: reaction.ionicEquation,
            animation: reaction.animation,
            safety: reaction.safety,
            kaboom: isKaboom,
            safetyWarning,
            explanation,
            safetyExplanation: reaction.safetyExplanation,
            atomicChanges: reaction.atomicChanges,
            didYouKnow: reaction.didYouKnow,
            reactantNames: pair.map(s => SYMBOL_MAP[s] || s),
          };
        }
      }

      if (!matched) {
        lastUnreactivePair = { chem1, chem2 };
      }
    }
  }

  // If we checked all pairs, found NO valid reactions, but found an unreactive pair
  if (lastUnreactivePair) {
    const { chem1, chem2 } = lastUnreactivePair;
    return {
      found: true,
      type: 'No Reaction',
      products: [],
      reactantBenchIds: [], // Don't remove anything
      equation: `${chem1.symbol} + ${chem2.symbol} → No Reaction`,
      ionicEquation: 'No reaction occurs under standard lab conditions.',
      animation: 'none',
      safety: 'safe',
      kaboom: false,
      safetyWarning: false,
      explanation: `Nothing happens! ${chem1.name} and ${chem2.name} do not react with each other under normal conditions.`,
      safetyExplanation: null,
      atomicChanges: null,
      didYouKnow: 'Not all chemicals react when mixed! Sometimes they just form a mixture without any chemical bonds breaking or forming.',
      reactantNames: [chem1.name, chem2.name],
    };
  }

  return { found: false };
}

export function getElementInfo(symbol) {
  const elements = {
    'Na': { name: 'Sodium', symbol: 'Na', atomicNumber: 11, state: 'Solid', color: 'Silvery-white', reactivity: 'Very High', hazard: 'red', uses: 'Street lights, table salt (NaCl)', electrons: [2, 8, 1], protons: 11, neutrons: 12 },
    'K': { name: 'Potassium', symbol: 'K', atomicNumber: 19, state: 'Solid', color: 'Silvery-white', reactivity: 'Extremely High', hazard: 'red', uses: 'Fertilizers, bananas', electrons: [2, 8, 8, 1], protons: 19, neutrons: 20 },
    'Fe': { name: 'Iron', symbol: 'Fe', atomicNumber: 26, state: 'Solid', color: 'Gray', reactivity: 'Moderate', hazard: 'green', uses: 'Steel, construction, tools', electrons: [2, 8, 14, 2], protons: 26, neutrons: 30 },
    'Zn': { name: 'Zinc', symbol: 'Zn', atomicNumber: 30, state: 'Solid', color: 'Bluish-silver', reactivity: 'Moderate', hazard: 'yellow', uses: 'Galvanization, batteries', electrons: [2, 8, 18, 2], protons: 30, neutrons: 35 },
    'Mg': { name: 'Magnesium', symbol: 'Mg', atomicNumber: 12, state: 'Solid', color: 'Shiny gray', reactivity: 'High', hazard: 'yellow', uses: 'Fireworks, flares, alloys', electrons: [2, 8, 2], protons: 12, neutrons: 12 },
    'Ca': { name: 'Calcium', symbol: 'Ca', atomicNumber: 20, state: 'Solid', color: 'Silver', reactivity: 'High', hazard: 'yellow', uses: 'Bones, cement, chalk', electrons: [2, 8, 8, 2], protons: 20, neutrons: 20 },
    'Cu': { name: 'Copper', symbol: 'Cu', atomicNumber: 29, state: 'Solid', color: 'Reddish-brown', reactivity: 'Low', hazard: 'green', uses: 'Wiring, coins, pipes', electrons: [2, 8, 18, 1], protons: 29, neutrons: 35 },
    'Al': { name: 'Aluminum', symbol: 'Al', atomicNumber: 13, state: 'Solid', color: 'Silver', reactivity: 'Moderate-High', hazard: 'yellow', uses: 'Cans, foil, aircraft', electrons: [2, 8, 3], protons: 13, neutrons: 14 },
    'Au': { name: 'Gold', symbol: 'Au', atomicNumber: 79, state: 'Solid', color: 'Golden yellow', reactivity: 'Very Low', hazard: 'green', uses: 'Jewelry, electronics, currency', electrons: [2, 8, 18, 32, 18, 1], protons: 79, neutrons: 118 },
    'Ag': { name: 'Silver', symbol: 'Ag', atomicNumber: 47, state: 'Solid', color: 'Shiny white', reactivity: 'Low', hazard: 'green', uses: 'Jewelry, photography, mirrors', electrons: [2, 8, 18, 18, 1], protons: 47, neutrons: 61 },
    'S': { name: 'Sulfur', symbol: 'S', atomicNumber: 16, state: 'Solid', color: 'Yellow', reactivity: 'Moderate', hazard: 'yellow', uses: 'Gunpowder, matches, vulcanization', electrons: [2, 8, 6], protons: 16, neutrons: 16 },
    'C': { name: 'Carbon', symbol: 'C', atomicNumber: 6, state: 'Solid', color: 'Black (graphite)', reactivity: 'Low', hazard: 'green', uses: 'Fuels, diamonds, life!', electrons: [2, 4], protons: 6, neutrons: 6 },
    'Cl': { name: 'Chlorine', symbol: 'Cl', atomicNumber: 17, state: 'Gas', color: 'Yellow-green', reactivity: 'High', hazard: 'red', uses: 'Water purification, bleach, PVC', electrons: [2, 8, 7], protons: 17, neutrons: 18 },
    'O₂': { name: 'Oxygen', symbol: 'O₂', atomicNumber: 8, state: 'Gas', color: 'Colorless', reactivity: 'High', hazard: 'yellow', uses: 'Breathing, combustion, steel', electrons: [2, 6], protons: 8, neutrons: 8 },
    'H₂': { name: 'Hydrogen', symbol: 'H₂', atomicNumber: 1, state: 'Gas', color: 'Colorless', reactivity: 'Moderate', hazard: 'yellow', uses: 'Fuel cells, ammonia production', electrons: [1], protons: 1, neutrons: 0 },
  };
  return elements[symbol] || null;
}

export default { checkReaction, getElementInfo };
