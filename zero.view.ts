namespace $.$$ {

	export class $optimade_zero extends $.$optimade_zero {

		search_page_body() {
			return [
				this.Search_input(),
				this.search_error() ? this.Search_error() : this.Search_results(),
				!this.search_error() && this.Search().results().length === 0 ? this.Search_nothing_found() : null,
			]
		}

		search_results() {
			if (!this.Search().search_params_labels().length) return []

			return this.Search().results().map(obj => this.Item(obj))
		}

		item_row( obj: $optimade_zero_entry ) {
			return [
				this.Id(obj),
				// obj.thumbs_link() ? this.Thumbs(obj) : null,
				obj.bib_id() ? this.Bib(obj) : null,
				this.Formula(obj),
				this.Property(obj),
				obj.ref_link() ? this.Ref(obj) : null,
				obj.pdf_link() ? this.Pdf(obj) : null,
				obj.png_link() ? this.Png(obj) : null,
				obj.gif_link() ? this.Gif(obj) : null,
			]
		}

		item_id(obj: $optimade_zero_entry) {
			return obj.id()
		}

		item_thumbs(obj: $optimade_zero_entry ) {
			return obj.thumbs_link()
		}

		item_html(obj: $optimade_zero_entry ) {
			return `<div>${obj.formula_html()}</div>`
		}

		item_property(obj: $optimade_zero_entry ) {
			return obj.property()
		}

		item_bib(obj: $optimade_zero_entry ) {
			return `${obj.bib_id()}'${obj.year().toString().slice(-2)}`
		}

		item_ref(obj: $optimade_zero_entry ) {
			return obj.ref_link()
		}

		item_pdf(obj: $optimade_zero_entry ) {
			return obj.pdf_link()
		}

		item_png(obj: $optimade_zero_entry ) {
			return obj.png_link()
		}

		item_gif(obj: $optimade_zero_entry ) {
			return obj.gif_link()
		}
	}
}
