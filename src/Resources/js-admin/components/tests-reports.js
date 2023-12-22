
	Vue.component("tests-reports", {
		mixins: [translationsController, formMixin],
		props: {
			reports: {type: Array, required: true}
		},
		data ()
		{
			return {
				label: null,
				ID: null
			}
		},
		created()
		{
			this.addValidations(c.validations.reports);
			this.addSubmitAction(this.addReport);
		},
		methods:
		{
			async addReport()
			{
				if (this.reports.find(item => item.ID === this.ID)) {
					this.formError = "tests_extra_reports_error_duplicate";

					setTimeout(function (self) {
						self.formError = null;
					}, 5000, this)
				} else {
					this.reports.push({label: this.label, ID: this.ID});
					this.resetForm();
					this.label = this.ID = null;
				}
			},

			removeReport(index)
			{
				this.reports.splice(index, 1);
			}
		},
		template: `<form @submit.prevent="submit" class="ts-form" :class="states">
	<section class="tests-reports">
		<div class="tests-reports-label">
		  	<ts-text v-model="label" label="tests_extra_reports_label_label" placeholder="tests_extra_reports_label_placeholder" :errors="errors['label']"></ts-text>
		</div>
		<div class="tests-reports-id">
			<ts-text v-model="ID" label="tests_extra_reports_id_label" placeholder="tests_extra_reports_id_placeholder" :errors="errors['ID']"></ts-text>
		</div>
	  	<div class="tests-reports-add">
		  	<span>&nbsp;</span>
          	<ts-submit label="tests_extra_reports_add" :states="states" :error="formError"></ts-submit>
		</div>
	</section>
	<section class="tests-reports-list">
	  	<ul>
			<li v-for="(report, index) in reports">
			  	<div class="tests-reports-item">
					<span>{{report.label}}</span>
					<span>{{report.ID}}</span>
                </div>
			  	<span class="tests-reports-item-remove" @click="removeReport(index)"><i class="fas fa-times"></i></span>
			</li>
		</ul>
	</section>
</form>`
	});