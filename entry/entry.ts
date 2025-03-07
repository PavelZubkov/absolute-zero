namespace $.$$ {
	export class $optimade_zero_entry extends $mol_store<typeof $optimade_zero_search_entry.Value> {

		fields() {
			return {
				entry_id: 0,
				formula: 1,
				property: 2,
				idk: 3,
				is_public: 4,
				bib_id: 5,
				year: 6,
				ref_id: 7,
			} as const
		}

		cdn_uri() {
			return 'https://mpds.io'
		}

		api_uri() {
			return 'https://api.mpds.io/v0'
		}

		id() {
			return this.value( this.fields().entry_id )
		}

		id_prefix() {
			return this.value( this.fields().entry_id ).split( '-' )[ 0 ]
		}

		type() {
			return this.id()[ this.fields().entry_id ]
		}

		formula_html() {
			return this.value( this.fields().formula )
		}

		property() {
			return this.value( this.fields().property )
		}

		is_public() {
			return this.value( this.fields().is_public )
		}

		bib_id() {
			return this.ref_id() === 999999 ? 0 : this.value( this.fields().bib_id )
		}

		year() {
			return this.value( this.fields().year )
		}

		ref_id() {
			return this.value( this.fields().ref_id )
		}

		res_link( fmt: 'pdf' | 'png' | 'gif' | 'json', sid = '' ) {
			return `${ this.api_uri() }/download/${ this.type().toLowerCase() }?q=${ this.id_prefix() }&sid=${ sid }&fmt=${ fmt }`
		}

		thumbs_link() {
			if (this.type() === 'P') return ''

			const thumbs_part = this.type() === 'C' ? `pd_thumbs/${ this.id_prefix() }` : 'rd_thumbs'
			return `${ this.cdn_uri() }/${ thumbs_part }/.png`
		}

		@ $mol_mem
		links(sid = '') {

			const links: Record<string, string> = {
				ref: `${ this.api_uri() }/download/bib?ref_id=${ this.ref_id() }&sid=${ sid }&fmt=bib`,
				pdf: this.res_link('pdf', sid),
				png: this.res_link('png', sid),
				gif: this.res_link('gif', sid),
				json: this.res_link('json', sid),
			}

			if (this.type() === 'P') {
				delete links.png
			} else {
				delete links.ref
				delete links.pdf
			}
			if (this.type() !== 'S') {
				delete links.gif
			}

			return links
		}

	}
}
