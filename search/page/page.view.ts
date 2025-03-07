namespace $.$$ {
	export class $optimade_zero_search_page extends $.$optimade_zero_search_page {

		@ $mol_mem
		Search() {
			return new $optimade_zero_search
		}

		body() {
			const empty = this.Search().is_empty()
			const arities = this.Search().arities().length
			const error = !empty && this.Search().search().error
			const search_count = this.Search().search().out?.length ?? 0

			return [
				this.Input(),
				... !empty && arities > 0 && !error ? [ this.Arity() ] : [],
				... !empty ? [ this.Refinements() ] : [],
				... !empty && search_count === 0 && !error ? [ this.Nothing_found() ] : [],
			]
		}

		arity_dict() {
			return this.Search().arity()
		}

		@$mol_mem
		refinements() {
			return this.Search().refinements()
		}

		@$mol_mem
		refinement_rows() {
			const obj = this.refinements().payload
			const list = this.refinements_order().map( facet => obj[ facet ]?.length ? this.Refinement( facet ) : null )
			return list.filter( Boolean )
		}

		refinement_label( facet: string ) {
			return this.Search().facet()[ facet as 'elements' ]
		}

		refinement_content( facet: string ) {
			return this.refinements().payload[ facet ]!.map( obj => this.Refinement_link( obj ) )
		}

		refinement_label_sub( facet: string ) {
			return [
				this.Refinement_label( facet ),
				... !this.Search().refinements().more[ facet ] ? [this.Refinement_show_more( facet )] : [],
			]
		}

		show_more( facet: string ) {
			this.Search().refinements_load_more( facet )
		}

		refinement_link_title( obj: typeof $optimade_zero_search_refinement_item.Value ) {
			return `${ obj.value }`
		}

		@$mol_mem_key
		refinement_link_arg( obj: typeof $optimade_zero_search_refinement_item.Value ) {
			const search = this.Search().clone()

			search.param_drop( obj.facet, null )
			search.param_add( obj.facet, obj.value )

			return { ...this.$.$mol_state_arg.dict(), ...search.param_dict() }
		}

		@$mol_mem
		arity( next?: string ) {
			if( next !== undefined ) {
				const reset = Object.keys( this.Search().arity() )
				reset.forEach( val => this.Search().param_drop( 'classes', val ) )

				this.Search().param_add( 'classes', next )
			}

			return next ?? ''
		}
		
	}
}
