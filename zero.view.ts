namespace $.$$ {

	export class $optimade_zero extends $.$optimade_zero {

		@ $mol_mem
		pages() {
			return [
				this.Search_page(),
				... this.$.$mol_state_arg.value('results') === '' ? [this.Results_page()] : [],
			]
		}

		@ $mol_mem
		count() {
			const count = this.Search().results_response().estimated_count
			return super.count().replace('{count}', `${count}`)
		}

		@ $mol_mem
		search_params( next?: $optimade_zero_search_params ): $optimade_zero_search_params {
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
			]
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

		@$mol_mem
		arity( next?: string ) {
			if (next !== undefined) {
				const reset = Object.values(this.Search().arity_names())
				reset.forEach(val => this.Search().param_drop('classes', val))

				this.Search().param_add('classes', next)
			}

			return next ?? ''
		}
	}
}
