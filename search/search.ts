namespace $ {

	const Rec = $mol_data_record
	const Str = $mol_data_string
	const Maybe = $mol_data_optional
	const Vary = $mol_data_variant
	const Nully = $mol_data_nullable
	const Arr = $mol_data_array
	const Num = $mol_data_number
	const Int = $mol_data_integer
	const Const = $mol_data_const
	const Bool = $mol_data_boolean

	const Guess_results = Rec( {
		formulae: Maybe( Str ),
		elements: Maybe( Str ),
		props: Maybe( Str ),
		classes: Maybe( Str ),
		numeric: Maybe( Arr( Rec( {
			0: Str,  // свойство
			1: Str,  // оператор
			2: Maybe( Num ) // значение
		} ) ) ),
		ignored: Arr( Str )
	} )

	const Refinement_response = Rec( {
		error: Nully( Str ),
		total_count: Int,
		payload: Arr( Rec( {
			facet: Vary(
				Const( 'elements' ),
				Const( 'props' ),
				Const( 'classes' ),
				Const( 'lattices' ),
			),
			value: Str,
			count: Int,
		} ) ),
	} )

	export const $optimade_zero_search_entry = Rec( {
		0: Str, // Entry
		1: Str, // Formula
		2: Str, // Property
		3: Int,
		4: Bool, // Is public data 
		5: Str, // Biblio id?
		6: Int, // Year
		7: Int, // Ref id
	} )

	const Facet_response = Rec( {
		error: Nully( Str ),
		fuzzy_notice: Maybe( Nully( Str ) ),
		notice: Maybe( Str ),
		estimated_count: Maybe( Int ),
		out: Maybe( Arr( $optimade_zero_search_entry ) ),
	} )

	const Suggest_response = Arr( Rec( {
		facet: val => val as keyof Search_params,
		label: Str,
		id: Str,
	} ) )

	type Search_params = {
		props?: string
		elements?: string
		classes?: string
		lattices?: string
		formulae?: string
		sgs?: string
		protos?: string
		aeatoms?: string
		aetypes?: string
		authors?: string
		codens?: string
		years?: string
		geos?: string
		orgs?: string
	}

	export class $optimade_zero_search extends $mol_object {

		@$mol_mem
		search_params( next?: Search_params ) {
			return this.$.$mol_state_arg.dict(next) ?? {}
		}

		search_param_add( facet: keyof Search_params, value: string ) {
			const params = this.search_params()
			let next = params[ facet ] ?? ''

			if( next.includes( value ) ) return

			if( !next ) next = value
			else next += `${ this.separator( facet ) }${ value }`

			this.search_params( { ...params, [ facet ]: next } )
		}

		search_param_drop( facet: keyof Search_params, value?: string ) {
			let { [ facet ]: next, ...params } = this.search_params()

			if( !value ) {
				this.search_params( { ...params } )
				return
			}

			const sep = this.separator( facet )
			next = next?.split( sep ).filter( val => val !== value ).join( sep )

			this.search_params( { ...params, [ facet ]: next } )
		}

		separator_default() {
			return ','
		}

		separator( facet: keyof Search_params ) {
			const obj = {
				elements: '-',
			} as Record<typeof facet, string>
			return obj[ facet ] ?? this.separator_default()
		}

		@$mol_mem
		search_params_api() {
			const params = { ...this.search_params() }
			if( params.formulae ) {
				params.formulae = params.formulae.replace( /<\/?sub>/g, '' )
			}
			const query = JSON.stringify( params )
			return query.replaceAll( this.separator_default(), ' ' )
		}

		@$mol_mem
		search_params_labels() {
			const result = [] as { facet: keyof Search_params, label: string }[]

			const keys = Object.keys( this.search_params() ) as Array<keyof Search_params>

			for( const facet of keys ) {
				const val = this.search_params()[ facet ]
				if( !val ) continue

				const values = val.split( this.separator( facet ) )
				values.forEach( label => result.push( { facet, label } ) )
			}

			return result
		}

		@$mol_mem
		filters() {
			const res = $mol_fetch.json( `https://api.mpds.io/v0/search/refinement?q=${ this.search_params_api() }` )
			return Refinement_response( res as any )
		}

		@$mol_mem
		results_response() {
			const res = $mol_fetch.json( `https://api.mpds.io/v0/search/facet?q=${ this.search_params_api() }` )
			return Facet_response( res as any )
		}

		@$mol_mem
		results() {
			return this.results_response().out?.map( tuple => new $optimade_zero_entry( tuple ) ) ?? []
		}

		@ $mol_mem
		error() {
			return this.results_response().error ?? ''
		}

		@$mol_mem_key
		suggests( query: string ) {
			const res = $mol_fetch.json( `https://api.mpds.io/v0/search/selectize?q=${ query }` )
			return Suggest_response( res as any )
		}

	}
}
