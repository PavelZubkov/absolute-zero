namespace $.$$ {

	export class $optimade_zero extends $.$optimade_zero {

		@$mol_mem
		Search() {
			return $optimade_zero_search.make({ param: (facet, next) => this.search_param(facet, next) })
		}

		@$mol_mem_key
		search_param( facet: string, next?: string | null ) {
			return this.$.$mol_state_arg.value(facet, next) ?? ''
		}

		@$mol_mem
		pages() {
			return [
				this.Search_page(),
				... this.$.$mol_state_arg.value( 'page' ) === 'results' ? [ this.Results_page() ] : [],
				... this.$.$mol_state_arg.value( 'page' ) === 'user' ? [ this.User_page() ] : [],
			]
		}

		@ $mol_mem
		search_page_foot() {
			const empty = this.Search().is_empty()
			const error = !empty && this.Search().search().error

			return [
				... empty ? [this.Example()] : [],
				... !empty && error ? [this.Error()] : [],
				... !empty && !error ? [this.Search_count()] : [],
				... !empty && !error ? [this.Open_results()] : [],
			]
		}

		error() {
			return this.Search().search().error ?? ''
		}

		@$mol_mem
		search_count() {
			const count = this.Search().search().estimated_count
			return super.search_count().replace( '{count}', `${ count ?? '...' }` )
		}

		login_icon() {
			return this.User().signed() ? [ this.Account_icon() ] : [ this.Login_icon() ]
		}

		@$mol_mem
		example_title() {
			$mol_state_time.now(2000)
			return this.$.$mol_array_lottery( this.Search().examples() )
		}

		example_open() {
			const title = this.example_title()
			this.Search().guess(title)
		}

		auto() {
			this.Search().search_parser_lib()
		}

	}
}
