namespace $.$$ {
	export class $optimade_zero_user_page extends $.$optimade_zero_user_page {

		title() {
			return this.User().signed()
				? this.welcome_label().replace('{name}', this.User().name())
				: this.sign_in_label()
		}

		body() {
			if (this.User().signed()) return [this.Profile()]

			const rec = this.$.$mol_state_arg.value('recovery')

			return [
				... rec === 'check' ? [this.Check_email()] : [],
				... rec === '' ? [this.Pass_recovery()] : [this.Login_form()],
			]
		}

		sign_in() {
			this.User().sign_in(this.login(), this.pass())
			this.login('')
			this.pass('')
			this.$.$mol_state_arg.value('recovery', null)
		}

		sign_out() {
			this.User().sign_out()
		}

		send_link() {
			this.User().pass_recovery(this.login())
			this.$.$mol_state_arg.value('recovery', 'check')
		}
		
	}
}
