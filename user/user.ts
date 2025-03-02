namespace $ {

	const Rec = $mol_data_record
	const Str = $mol_data_string

	const Response = Rec({
		name: Str,
		sid: Str,
	})

	export class $optimade_zero_user extends $mol_object {
		
		uri() {
			return 'https://api.mpds.io/v0/users'
		}

		@ $mol_action
		sign_in(login: string, pass: string) {
			const form = new FormData()
			form.append('login', login)
			form.append('pass', pass)

			const res = this.$.$mol_fetch.json(`${this.uri()}/login`, { method: 'post', body: form })
			const json = Response(res as any)
			this.data(json)
		}

		@ $mol_action
		sign_out() {
			const form = new FormData()
			form.append('sid', this.sid())
			this.$.$mol_fetch.json(`${this.uri()}/logout`, { method: 'post', body: form })
			this.data(null)
		}

		@ $mol_mem
		data( next?: typeof Response.Value | null ) {
			return this.$.$mol_state_local.value('user', next) ?? null
		}

		name() {
			return this.data()?.name ?? ''
		}

		sid() {
			return this.data()?.sid ?? ''
		}

		signed() {
			return !!this.data()
		}
		
	}
}
