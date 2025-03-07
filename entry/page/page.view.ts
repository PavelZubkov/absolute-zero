namespace $.$$ {
	export class $optimade_zero_entry_page extends $.$optimade_zero_entry_page {

		@$mol_mem
		Search() {
			return new $optimade_zero_search
		}

		title() {
			return super.title().replace( '{count}', `${ this.Search().search()?.out?.length ?? 0 }` )
		}

		search_results() {
			const out = this.Search().search().out
			return out?.map( obj => this.Card( obj ) ) ?? []
		}

		card_content( obj: $optimade_zero_entry ) {
			return [
				...obj.thumbs_link() ? [ this.Thumbs_label( obj ) ] : [],
				this.Id_label( obj ),
				this.Property_label( obj ),
				this.Formula_label( obj ),
				...obj.bib_id() ? [ this.Bib_label( obj ) ] : [],
				this.Card_links( obj ),
			]
		}

		item_thumbs( obj: $optimade_zero_entry ) {
			return obj.thumbs_link()
		}

		item_id( obj: $optimade_zero_entry ) {
			return obj.id()
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

		links( obj: $optimade_zero_entry ) {
			const formats = Object.keys( obj.links() )
			return formats.map(format => this.Link([obj, format]))
		}

		link_uri( [obj, format]: [$optimade_zero_entry, string] ) {
			return obj.links( this.User().sid() )[format]
		}

		link_title( [obj, format]: [$optimade_zero_entry, string] ) {
			return format
		}

	}
}
