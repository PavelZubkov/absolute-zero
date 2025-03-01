namespace $ {
	export class $optimade_zero_entry extends $mol_store<typeof $optimade_zero_search_entry.Value> {

		cdn_uri() {
			return 'https://mpds.io'
		}

		api_uri() {
			return 'https://api.mpds.io/v0'
		}

		id() {
			return this.value( 0 )
		}

		id_prefix() {
			return this.value( 0 ).split( '-' )[ 0 ]
		}

		type() {
			return this.id()[ 0 ]
		}

		formula_html() {
			return this.value( 1 )
		}

		property() {
			return this.value( 2 )
		}

		data_type() {
			if( this.value( 3 ) === 7 ) return 'ml_data'
			if( [ 8, 9, 10, 11 ].includes( this.value( 3 ) ) ) return 'ab_data'
			return ''
		}

		is_public() {
			return this.value( 4 )
		}

		bib_id() {
			return this.ref_id() === 999999 ? 0 : this.value( 5 )
		}

		year() {
			return this.value( 6 )
		}

		ref_id() {
			return this.value( 7 )
		}

		thumbs_link() {
			if( this.type() === 'P' ) return ''
			return `${ this.cdn_uri() }/${ this.type() === 'C' ? `pd_thumbs/${ this.id_prefix() }` : 'rd_thumbs' }/.png`
		}

		ref_link() {
			if( this.type() !== 'P' ) return ''
			return `${ this.api_uri() }/download/bib?ref_id=${ this.ref_id() }&sid=&fmt=bib`
		}

		pdf_link() {
			if( this.type() !== 'P' ) return ''
			return `${ this.api_uri() }/download/${ this.type().toLowerCase() }?q=${ this.id_prefix() }&sid=&fmt=pdf`
		}

		png_link() {
			if( this.type() === 'P' ) return ''
			return `${ this.api_uri() }/download/${ this.type().toLowerCase() }?q=${ this.id_prefix() }&sid=&fmt=png`
		}

		gif_link() {
			if( this.type() !== 'S' ) return ''
			return `${ this.api_uri() }/download/${ this.type().toLowerCase() }?q=${ this.id_prefix() }&fmt=gif`
		}

	}
}
