namespace $.$$ {

	type Search_params_label = ReturnType<$optimade_zero_search['search_params_labels']>[number]

	export class $optimade_zero_search_input extends $.$optimade_zero_search_input {

		@$mol_mem_key
		suggests_request( key: string ) {
			console.log('suggests_request', `"${key}"`)
			return this.Search().suggests( key )
		}

		suggests() {
			console.log('suggests', `"${this.query()}"`)
			if( !this.query().trim() ) return []

			this.$.$mol_wait_timeout( 1000 )

			const list = this.suggests_request( this.query() ).map( obj => obj.label )
			return list
		}

		suggest_select( query: string, event?: MouseEvent ) {
			console.log('suggest_select', `"${query}"`)
			const suggest = this.suggests_request(this.query()).find(obj => obj.label === query)
			if (!suggest) throw new Error('OPS')

			this.Search().search_param_add(suggest.facet, suggest.label)
			this.query('')
			this.Query().focused( true )
		}

		@ $mol_mem
		tags() {
			return this.Search().search_params_labels().map(obj => this.Tag(obj))
		}

		tag_label(obj: Search_params_label) {
			return obj.label
		}

		tag_drop(obj: Search_params_label) {
			this.Search().search_param_drop(obj.facet, obj.label)
		}

		suggest_html_label( suggest_label: string ) {
			return `<div>${suggest_label}</div>`
		}

		suggest_content( suggest_label: string ) {
			const suggest = this.suggests_request(this.query()).find(obj => obj.label === suggest_label)!

			return suggest.facet === 'formulae' ? [this.Suggest_formula(suggest_label)] : super.suggest_content(suggest_label)
		}

	}
}
