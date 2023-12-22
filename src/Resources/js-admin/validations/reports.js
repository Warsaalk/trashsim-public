(function (validations) {

	let label = new c.ValidationProperty(c.ValidationProperty.TYPE_OPEN);
	label.setRules({MIN_LENGTH: 3});
	label.setRequired();

	validations["label"] = label;

	let ID = new c.ValidationProperty(c.ValidationProperty.TYPE_OPEN);
	ID.setRules({REGEX: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i});
	ID.setRequired();

	validations["ID"] = ID;

})(c.validations.reports = {});