namespace $.$$ {
	export class $optimade_zero_user_page extends $.$optimade_zero_user_page {

		title() {
			return this.User().signed()
				? this.welcome_label().replace('{name}', this.User().name())
				: this.sign_in_label()
		}

		body() {
			return this.User().signed() ? [this.Profile()] : [this.Login_form()]
		}

		sign_in() {
			this.User().sign_in(this.login(), this.pass())
			this.login('')
			this.pass('')
		}

		sign_out() {
			this.User().sign_out()
		}
		
	}
}
