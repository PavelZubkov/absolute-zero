namespace $.$$ {

	const Rec = $mol_data_record
	const Str = $mol_data_string
	const Maybe = $mol_data_optional
	const Nully = $mol_data_nullable
	const Arr = $mol_data_array
	const Int = $mol_data_integer
	const Bool = $mol_data_boolean

	export const $optimade_zero_search_refinement_item = Rec( {
		facet: Str,
		value: Str,
		count: Int,
	} )

	const Refinements_response = Rec( {
		error: Nully( Str ),
		payload: Maybe( Arr( $optimade_zero_search_refinement_item ) ),
	} )

	const Refinements_more_response = Rec( {
		error: Nully( Str ),
		total_count: Int,
		payload: Arr( Rec( {
			0: Str,
			1: Int,
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

	const Search_response = Rec( {
		error: Nully( Str ),
		fuzzy_notice: Maybe( Nully( Str ) ),
		notice: Maybe( Str ),
		estimated_count: Maybe( Int ),
		out: Maybe( Arr( $optimade_zero_search_entry ) ),
	} )

	const Suggests_response = Arr( Rec( {
		facet: Str,
		label: Str,
		id: Str,
	} ) )

	type Refinement = { payload: Record<string, typeof $optimade_zero_search_refinement_item.Value[]>, error: string | null, more: Record<string, boolean | undefined> }

	export class $optimade_zero_search extends $.$optimade_zero_search {

		@$mol_mem_key
		param( facet: string, next?: string | null ) {
			return next ?? ''
		}

		param_add( facet: string, value: string ) {
			const next = [ this.param( facet ), value ].filter( Boolean ).join( this.separator( facet ) )
			this.param( facet, next )
		}

		param_drop( facet: string, value: string | null ) {
			const sep = this.separator( facet )
			const next = value === null
				? null
				: this.param( facet ).split( sep ).filter( val => val !== value ).join( sep )

			this.param( facet, next )
		}

		@$mol_mem
		extend_param( next?: string[] ) {
			return next ?? ''
		}

		drop_all() {
			Object.keys( this.facet() ).forEach( facet => this.param_drop( facet, null ) )
		}

		separator( facet: string ) {
			return super.separators()[ facet as 'elements' ] ?? super.separators()[ 'default' ]
		}

		@$mol_mem
		param_dict() {
			const keys = Object.keys( this.facet() )
			const dict = {} as Record<string, string>

			for( const facet of keys ) {
				let value = this.param( facet )
				if( !value ) continue

				dict[ facet ] = value
			}

			return dict
		}

		param_api( extend?: string ) {
			const dict = this.param_dict()
			if( dict[ 'formulae' ] ) dict[ 'formulae' ] = dict[ 'formulae' ].replace( /<\/?sub>/g, '' )
			if( extend ) dict[ this.refinements_extend_param() ] = extend
			return JSON.stringify( dict )
		}

		clone() {
			const next = new $optimade_zero_search

			for( const facet of Object.keys( this.param_dict() ) ) {
				if( this.param( facet ) ) {
					next.param( facet, this.param( facet ) )
				}
			}

			return next
		}

		is_empty() {
			return Object.keys( this.param_dict() ).length === 0
		}

		@$mol_mem
		refinements( next?: Refinement ) {
			if( next ) return next

			const res = $mol_fetch.json( `${ this.refinements_uri() }?q=${ this.param_api() }` )
			const json = Refinements_response( res as any )

			if( !json || json?.error || !json?.payload ) return { payload: {}, error: json?.error, more: {} }

			for( const item of json.payload ) {
				if( item.facet === 'elements' ) {
					( item.value as any ) = item.value.split( ',' ).map( v => v.trim() ).join( this.separator( 'elements' ) )
				}
			}

			const dict = {} as Record<string, typeof $optimade_zero_search_refinement_item.Value[]>

			for( const item of json.payload ) {
				const list = dict[ item.facet ] = dict[ item.facet ] ?? []
				list.push( item )
			}

			return { payload: dict, error: json.error, more: {} }
		}

		@$mol_action
		refinements_load_more( facet: string ) {
			const res = $mol_fetch.json( `${ this.refinements_uri() }?q=${ this.param_api( facet ) }` )
			const json = Refinements_more_response( res as any )

			const list = json.payload.map( v => ( { facet, value: v[ 0 ], count: v[ 1 ] } ) )
			const { payload, error, more } = this.refinements()

			const next = {
				error,
				payload: {
					...payload,
					[ facet ]: [ ...payload[ facet ], ...list ],
				},
				more: {
					...more,
					[ facet ]: true,
				},
			}
			this.refinements( next )
		}

		@$mol_mem_key
		suggests( query: string ) {
			const res = $mol_fetch.json( `${ this.suggests_uri() }?q=${ query }` )
			return Suggests_response( res as any )
		}

		@$mol_mem
		search() {
			const res = $mol_fetch.json( `${ this.search_uri() }?q=${ this.param_api() }` )
			const json = Search_response( res as any )

			const Entry = this.$.$optimade_zero_entry
			// TODO why?
			return { ...json, out: json.out?.map(obj => new Entry(obj)) ?? [] }
		}

		@$mol_mem
		arities() {
			if( this.param( 'formulae' ) ) return []

			const arity = [] as string[]

			const count = this.param( 'elements' ).split( this.separator( 'elements' ) ).length ?? 0
			const keys = Object.keys( this.arity() )

			for( let i = count; i < 5; i++ ) {
				const name = keys[ i ]
				arity.push( name )
			}

			return arity
		}


	}
}
