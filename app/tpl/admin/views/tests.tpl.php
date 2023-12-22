<?php
use Plinth\Response\Response;
/* @var $self Response */
?>
<div class="admin-breadcrumbs">
    <ul>
        <li><router-link to="/">Home</router-link></li>
        <li>Algorithm tests</li>
    </ul>
</div>
<div class="tests-container">
    <h1>Algorithm tests</h1>
    <div class="tests-settings">
		<div class="tests-settings-left">
			<form @submit.prevent="submit" class="ts-form" :class="states">
				<section>
					<div>
						<ts-text v-model="ogotchaApiKey" label="OGotcha API key" :errors="errors['ogotchaApiKey']"></ts-text>
					</div>
					<div>
						<ts-checkbox v-model="defaultReportsEnabled" label="tests_enable_default_reports" :errors="errors['defaultReportsEnabled']"></ts-checkbox>
					</div>
				</section>
				<section>
					<ts-submit label="Run tests" :states="states" :error="formError" :waiting="running"></ts-submit>
				</section>
			</form>
		</div>
		<div class="tests-settings-right">
			<tests-reports :reports.sync="extraReports"></tests-reports>
		</div>
    </div>
    <div class="tests-groups">
        <ul>
            <simulation-test-group v-for="(group, groupKey) in testGroups" :name="groupKey" :reports="group.reports" :ogotcha-api-key="ogotchaApiKey" ref="simulationGroups" @done="runGroupDone" @fail="runGroupFail"></simulation-test-group>
        </ul>
    </div>
</div>

