namespace $.$$ {

	type Label = { facet: string, title: string }

	export class $optimade_zero_search_input extends $.$optimade_zero_search_input {

		@ $mol_mem
		Search() {
			return new $optimade_zero_search
		}

		@$mol_mem_key
		suggests_request( key: string ) {
			return this.Search().suggests( key )
		}

		suggests() {
			if( !this.query().trim() ) return []

			this.$.$mol_wait_timeout( 1000 )

			const list = this.suggests_request( this.query() ).map( obj => obj.label )
			return list
		}

		suggest_select( query: string, event?: MouseEvent ) {
			const suggest = this.suggests_request(this.query()).find(obj => obj.label === query)
			if (!suggest) throw new Error('OPS')

			this.Search().param_add(suggest.facet, suggest.label)
			this.query('')
			this.Query().focused( true )
		}

		@ $mol_mem
		tags() {
			const list = [] as Label[]

			const keys = Object.keys(this.Search().facet()).sort((a, b) => a.localeCompare(b))

			for( const facet of keys ) {
				const value = this.Search().param( facet )
				if( !value ) continue

				const values = value.split( this.Search().separator( facet ) )
				values.forEach( title => list.push( { facet, title } ) )
			}

			return list.map(obj => this.Tag(obj))
		}

		tag_label(obj: Label) {
			return obj.title
		}

		tag_drop(obj: Label) {
			this.Search().param_drop(obj.facet, obj.title)
		}

		suggest_html_label( suggest_label: string ) {
			return `<div>${suggest_label}</div>`
		}

		suggest_content( suggest_label: string ) {
			const suggest = this.suggests_request(this.query()).find(obj => obj.label === suggest_label)!

			return suggest.facet === 'formulae' ? [this.Suggest_formula(suggest_label)] : super.suggest_content(suggest_label)
		}

		clear_enabled(): boolean {
			return !this.Search().is_empty()
		}

		clear() {
			this.Search().drop_all()
		}

	}
}
