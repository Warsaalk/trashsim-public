(function (validations) {

	let ogotchaApiKey = new c.ValidationProperty(c.ValidationProperty.TYPE_OPEN);
	ogotchaApiKey.setRules({REGEX: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i});
	ogotchaApiKey.setRequired();

	validations["ogotchaApiKey"] = ogotchaApiKey;

	let defaultReportsEnabled = new c.ValidationProperty(c.ValidationProperty.TYPE_OPEN);
	defaultReportsEnabled.setBoolean();
	defaultReportsEnabled.setRequired();

	validations["defaultReportsEnabled"] = defaultReportsEnabled;

})(c.validations.tests = {});