namespace $ {

	const Rec = $mol_data_record
	const Str = $mol_data_string
	const Bool = $mol_data_boolean
	const Maybe = $mol_data_optional
	const Vary = $mol_data_variant
	const Const = $mol_data_const

	const Sign_in_response = Rec( {
		name: Str,
		sid: Str,
		acclogin: Str,
		admin: Bool,
		ipbased: Bool,
	} )

	// type Perms = {
	// 	gui?:
	// 	| { root?: true }
	// 	| { [ key: string ]: string[] | undefined; refs?: 'ALL' | 'MENTIONED' }[]
	// 	api?:
	// 	| { root?: true; disabled?: true }
	// 	| { [ key: string ]: string[] | undefined }[]
	// }

	// const Perms_response = Rec( {
	// 	error: Maybe( Str ),
	// 	gui: Maybe(
	// 		Vary(
	// 			Rec( { root: Const(true) } ),
	// 		),
	// 	),
	// 	api: Maybe(),
	// } )

	export class $optimade_zero_user extends $mol_object {

		uri() {
			return 'https://api.mpds.io/v0/users'
		}

		@$mol_action
		sign_in( login: string, pass: string ) {
			const form = new FormData()
			form.append( 'login', login )
			form.append( 'pass', pass )

			const res = this.$.$mol_fetch.json( `${ this.uri() }/login`, { method: 'post', body: form } )
			const json = Sign_in_response( res as any )
			this.data( json )
		}

		@$mol_action
		sign_out() {
			this.data( null )
			const form = new FormData()
			form.append( 'sid', this.sid() )
			this.$.$mol_fetch.json( `${ this.uri() }/logout`, { method: 'post', body: form } )
		}

		@$mol_action
		pass_recovery( login: string ) {
			const form = new FormData()
			form.append( 'login', login )
			this.$.$mol_fetch.json( `${ this.uri() }/lost_password`, { method: 'post', body: form } )
		}

		// @$mol_action
		// pass_new() {
		// 	// https://api.mpds.io/v0/users/new_password
		// 	/*
		// 		new_password: 123qweASD
		// 		sid
		// 		ed: 0

		// 		+ update sid
		// 	*/
		// }

		// @$mol_mem
		// perms() {
		// 	const form = new FormData()
		// 	form.append( 'sid', this.sid() )
		// 	const path = this.ip_based() ? 'ip_perms' : 'perms'
		// 	const res = this.$.$mol_fetch.json( `${ this.uri() }/${ path }`, { method: 'post', body: form } )

		// }

		@$mol_mem
		data( next?: typeof Sign_in_response.Value | null ) {
			return this.$.$mol_state_local.value( 'user', next ) ?? null
		}

		name() {
			return this.data()?.name ?? ''
		}

		sid() {
			return this.data()?.sid ?? ''
		}

		ip_based() {
			return this.data()?.ipbased ?? false
		}

		signed() {
			return !!this.data()
		}

	}
}
