namespace $.$$ {
	
	$mol_style_define( $optimade_zero_search_input, {

		width: '100%',
		
		Anchor: {
			flex: {
				direction: 'column',
			},
			gap: $mol_gap.space,
		},

		Suggest_formula: {
			Paragraph: {
				padding: 0,
			},
		},

		Input: {
			gap: $mol_gap.space,
		},
		
		Tags: {
			flexWrap: 'wrap',
			gap: $mol_gap.space,
		},

		Tag: {
			border: {
				width: '1px',
				style: 'solid',
				color: $mol_theme.line,
				radius: $mol_gap.round,
			},
		}
	} )
	
}
