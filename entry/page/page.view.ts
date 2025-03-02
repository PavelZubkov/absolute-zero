namespace $.$$ {
	export class $optimade_zero_entry_page extends $.$optimade_zero_entry_page {

		title() {
			return super.title().replace('{count}', `${this.Search().results().length}`)
		}
		
		search_results() {
			if( !this.Search().params_labels().length ) return []

			return this.Search().results().map( obj => this.Card( obj ) )
		}

		card_content( obj: $optimade_zero_entry ) {
			return [
				... obj.thumbs_link() ? [this.Thumbs_label(obj)] : [],
				this.Id_label( obj ),
				this.Property_label( obj ),
				this.Formula_label( obj ),
				...obj.bib_id() ? [this.Bib_label( obj )] : [],
				this.Card_links(obj),
			]
		}

		links( obj: $optimade_zero_entry ) {
			return [
				...obj.ref_link() ? [this.Ref(obj)] : [],
				...obj.pdf_link() ? [this.Pdf(obj)] : [],
				...obj.png_link() ? [this.Png(obj)] : [],
				...obj.gif_link() ? [this.Gif(obj)] : [],
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
		
	}
}
