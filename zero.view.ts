namespace $.$$ {

	export class $optimade_zero extends $.$optimade_zero {

		@ $mol_mem
		pages() {
			return [
				this.Search_page(),
				... this.$.$mol_state_arg.value('page') === 'results' ? [this.Results_page()] : [],
				... this.$.$mol_state_arg.value('page') === 'user' ? [this.User_page()] : [],
			]
		}

		@ $mol_mem
		count() {
			const count = this.Search().results_response().estimated_count
			return super.count().replace('{count}', `${count}`)
		}

		@ $mol_mem
		search_params( next?: $optimade_zero_search_params ): $optimade_zero_search_params {
			// depend from other url params
			// return this.$.$mol_state_arg.dict( next ) ?? {}
			const keys = Object.keys(this.Search().param_names()) as (keyof $optimade_zero_search_params)[]

			if (next !== undefined) {
				for (const key of keys) {
					this.$.$mol_state_arg.value(key, next[key] ?? null)
				}
				return next
			}

			const params = {} as $optimade_zero_search_params
			for (const key of keys) {
				const val = this.$.$mol_state_arg.value(key)
				if (!val) continue
				params[key] = val
			}

			return params
		}

		search_empty() {
			return Object.keys(this.search_params()).length === 0
		}

		search_page_tools() {
			return this.search_empty() ? [] : [this.Count()]
		}

		search_page_body() {

			if( !this.search_empty() && this.search_error() ) {
				return [
					this.Search_input(),
					this.Search_error(),
				]
			}

			const arity = this.Search().arity().length
			const results = this.search_empty() ? 0 : this.Search().results().length

			return [
				this.Search_input(),
				... !this.search_empty() && arity > 0 ? [ this.Arity() ] : [],
				... this.search_empty() ? [] : [this.Refinements()],
				... !this.search_empty() && results === 0 ? [ this.Search_nothing_found() ] : [],
				... this.search_empty() ? [ this.Search_start_typing() ] : [],
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

		login_icon() {
			return this.User().signed() ? [this.Account_icon()] : [this.Login_icon()]
		}

		clear_search() {
			this.search_params({})
		}
	}
}
