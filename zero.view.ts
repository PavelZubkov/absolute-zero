namespace $.$$ {

	export class $optimade_zero extends $.$optimade_zero {

		@ $mol_mem
		search_params( next?: $optimade_zero_search_params ): $optimade_zero_search_params {
			console.log('1231231')
			return this.$.$mol_state_arg.dict( next ) ?? {}
		}

		search_page_body() {
			if( this.search_error() ) {
				return [
					this.Search_input(),
					this.Search_error(),
				]
			}

			return [
				this.Search_input(),
				... this.Search().arity().length > 0 ? [ this.Arity() ] : [],
				this.Refinements(),
				... this.Search().results().length === 0 ? [ this.Search_nothing_found() ] : [],
				this.Search_results(),
			]
		}

		search_results() {
			if( !this.Search().params_labels().length ) return []

			return this.Search().results().map( obj => this.Item( obj ) )
		}

		item_row( obj: $optimade_zero_entry ) {
			return [
				this.Id( obj ),
				// obj.thumbs_link() ? this.Thumbs(obj) : null,
				obj.bib_id() ? this.Bib( obj ) : null,
				this.Formula( obj ),
				this.Property( obj ),
				obj.ref_link() ? this.Ref( obj ) : null,
				obj.pdf_link() ? this.Pdf( obj ) : null,
				obj.png_link() ? this.Png( obj ) : null,
				obj.gif_link() ? this.Gif( obj ) : null,
			]
		}

		item_id( obj: $optimade_zero_entry ) {
			return obj.id()
		}

		item_thumbs( obj: $optimade_zero_entry ) {
			return obj.thumbs_link()
		}

		item_html( obj: $optimade_zero_entry ) {
			return `<div>${ obj.formula_html() }</div>`
		}

		item_property( obj: $optimade_zero_entry ) {
			return obj.property()
		}

		item_bib( obj: $optimade_zero_entry ) {
			return `${ obj.bib_id() }'${ obj.year().toString().slice( -2 ) }`
		}

		item_ref( obj: $optimade_zero_entry ) {
			return obj.ref_link()
		}

		item_pdf( obj: $optimade_zero_entry ) {
			return obj.pdf_link()
		}

		item_png( obj: $optimade_zero_entry ) {
			return obj.png_link()
		}

		item_gif( obj: $optimade_zero_entry ) {
			return obj.gif_link()
		}

		arity_dict() {
			return this.Search().arity().reduce( ( dict, name ) => {
				dict[ name ] = name
				return dict
			}, {} as Record<string, string> )
		}

		@$mol_mem
		refinements() {
			const order: ( keyof $optimade_zero_search_params )[] = [
				'elements',
				'formulae',
				'props',
				'classes',
				'lattices',
			]
			const obj = this.Search().refinements()

			return order.map( facet => obj[ facet ]?.length ? this.Refinement( facet ) : null ).filter( Boolean )
		}

		refinement_title( facet: keyof $optimade_zero_search_params ) {
			return this.Search().param_names()[ facet ]
		}

		refinement_content( facet: keyof $optimade_zero_search_params ) {
			return this.Search().refinements()[ facet ]!.map( obj => this.Refinement_link( obj ) )
		}

		refinement_link_title( obj: typeof $optimade_zero_search_refinement_item.Value ) {
			return `${ obj.value }`
		}

		@ $mol_mem_key
		refinement_link_arg( obj: typeof $optimade_zero_search_refinement_item.Value ) {
			const search = new $optimade_zero_search()
			search.params( this.search_params() )
			search.param_drop(obj.facet)
			search.param_add(obj.facet, obj.value)
			return search.params()
		}
	}
}
