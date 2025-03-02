namespace $ {

	const Rec = $mol_data_record
	const Str = $mol_data_string
	const Maybe = $mol_data_optional
	const Nully = $mol_data_nullable
	const Arr = $mol_data_array
	const Int = $mol_data_integer
	const Bool = $mol_data_boolean

	export const $optimade_zero_search_refinement_item = Rec( {
		facet: val => val as keyof $optimade_zero_search_params,
		value: Str,
		count: Int,
	} )

	const Refinement_response = Rec( {
		error: Nully( Str ),
		total_count: Int,
		payload: Arr( $optimade_zero_search_refinement_item ),
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
		facet: val => val as keyof $optimade_zero_search_params,
		label: Str,
		id: Str,
	} ) )

	export type $optimade_zero_search_params = {
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
		doi?: string
		numeric?: string
	}

	export class $optimade_zero_search extends $mol_object {

		@$mol_mem
		params( next?: $optimade_zero_search_params ): $optimade_zero_search_params {
			return next ?? {}
		}

		param_add( facet: keyof $optimade_zero_search_params, value: string ) {
			const params = this.params()
			let next = params[ facet ] ?? ''

			if( next.includes( value ) ) return

			if( !next ) next = value
			else next += `${ this.separator( facet ) }${ value }`

			this.params( { ...params, [ facet ]: next } )
		}

		param_drop( facet: keyof $optimade_zero_search_params, value?: string ) {
			let { [ facet ]: next, ...params } = this.params()

			if( !value ) {
				this.params( { ...params } )
				return
			}

			const sep = this.separator( facet )
			next = next?.split( sep ).filter( val => val !== value ).join( sep )

			this.params( { ...params, [ facet ]: next } )
		}

		separator_default() {
			return ','
		}

		separator( facet: keyof $optimade_zero_search_params ) {
			const obj = {
				elements: '-',
			} as Record<typeof facet, string>
			return obj[ facet ] ?? this.separator_default()
		}

		@$mol_mem
		params_api() {
			const params = { ...this.params() }
			if( params.formulae ) {
				params.formulae = params.formulae.replace( /<\/?sub>/g, '' )
			}
			const query = JSON.stringify( params )
			return query
		}

		@$mol_mem
		params_labels() {
			const result = [] as { facet: keyof $optimade_zero_search_params, label: string }[]

			const keys = Object.keys( this.params() ) as Array<keyof $optimade_zero_search_params>

			for( const facet of keys ) {
				const val = this.params()[ facet ]
				if( !val ) continue

				const values = val.split( this.separator( facet ) )
				values.forEach( label => result.push( { facet, label } ) )
			}

			return result
		}

		@$mol_mem
		results_response() {
			const res = $mol_fetch.json( `https://api.mpds.io/v0/search/facet?q=${ this.params_api() }` )
			return Facet_response( res as any )
		}

		@$mol_mem
		results() {
			return this.results_response().out?.map( tuple => new $optimade_zero_entry( tuple ) ) ?? []
		}

		@$mol_mem
		error() {
			return this.results_response().error ?? ''
		}

		@$mol_mem_key
		suggests( query: string ) {
			const res = $mol_fetch.json( `https://api.mpds.io/v0/search/selectize?q=${ query }` )
			return Suggest_response( res as any )
		}

		arity_names() {
			return {
				0: 'unary',
				1: 'binary',
				2: 'ternary',
				3: 'quaternary',
				4: 'quinary',
				5: 'multinary',
			} as { [ key: string ]: string }
		}

		param_names() {
			return {
				aeatoms: 'Polyhedron atoms',
				aetypes: 'Polyhedral types',
				authors: 'Authors',
				classes: 'Materials classes',
				codens: 'Journal codes',
				doi: 'DOI',
				elements: 'Chemical elements',
				formulae: 'Chemical formulae',
				geos: 'Geography',
				lattices: 'Crystal systems',
				numeric: 'Numerical search',
				orgs: 'Organization',
				props: 'Physical properties',
				protos: 'Prototypes',
				sgs: 'Space groups',
				years: 'Years',
			}
		}

		@$mol_mem
		refinements_response() {
			const res = $mol_fetch.json( `https://api.mpds.io/v0/search/refinement?q=${ this.params_api() }` )
			const json = Refinement_response( res as any )

			for (const item of json.payload) {
				if (item.facet === 'elements') {
					(item.value as any) = item.value.split(',').map(v => v.trim()).join( this.separator('elements') )
				}
			}

			return json
		}

		@$mol_mem
		refinements() {
			const refinements = {} as Record<keyof $optimade_zero_search_params, typeof $optimade_zero_search_refinement_item.Value[] | undefined>

			for( const item of this.refinements_response().payload ) {
				const list = refinements[ item.facet ] = refinements[ item.facet ] ?? []
				list.push( item )
			}

			return refinements
		}

		@$mol_mem
		arity() {
			const arity = [] as string[]

			const params = this.params()

			if( !params.formulae ) {
				const current_arity = params.elements?.split( this.separator( 'elements' ) ).length ?? 0

				for( let i = current_arity; i < 5; i++ ) {
					const name = this.arity_names()[ i ]
					arity.push( name )
				}
			}

			return arity
		}


	}
}
