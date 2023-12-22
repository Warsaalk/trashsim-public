array(
	'variable' => array(
		'[name]' => array(
			'rules' => array( {optional}
				Validator::RULE_* => mixed
			) 
			'type' => Validator::PARAM_* {optional}
			'required' => boolean {optional}
			'default' => mixed {optional}
         	'message' => Info {optional}
			'preCallback' => function {optional} 
			'postCallback' => function {optional}
		)
	)
	'userlevel' => User::[name] {optional}
	'token' => boolean {optional}
)