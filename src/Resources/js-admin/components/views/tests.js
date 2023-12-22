
	c.createRouteComponent("tests", "/tests", "admin/html/components/views/tests.html",
	{
		mixins: [formMixin],
		data()
		{
			return {
				ogotchaApiKey: null,
				defaultReports: [
					{label: "10K LF + / vs 1 S shield - 0.8333 - bounce", ID: "d5e9b5ca-0e66-50f5-9a1f-6b81423cd6ef"}, // bounce effect
					{label: "10K LF + / vs 1 S shield - 0.9167 - bounce", ID: "dd668e08-6039-50a6-89cf-f0c9e3d77e61"}, // bounce effect
					{label: "10K LF + / vs 1 S shield - 1 - bounce", ID: "0b55e934-901b-52c9-b85b-995b1255f9df"}, // bounce effect
					{label: "99 LF + 1K recs vs 1 S shield - 1.0833 - shield hold", ID: "eda56aeb-01cc-5d82-a8de-89ffc289e1c2"}, // bounce effect
					{label: "100 LF + 1K recs vs 1 S shield - 1.0833 - win", ID: "7f33a748-216f-5266-a153-17948b4a20ec"}, // bounce effect
					{label: "50 XX + 10K LF vs 1 L shield - 1.3333 - shield hold", ID: "e9030ac6-1fed-5504-a5e3-a35b728e4c06"}, // damage effect
					{label: "55 XX + 10K LF vs 1 L shield - 1.3333 - shield hold", ID: "fe63dcbc-9d4d-5b0f-8d20-5ef9666d0214"}, // damage effect
					{label: "75 XX + 10K LF vs 1 L shield - 1.3333 - shield hold", ID: "7a63ba6b-9afb-5eed-925e-ad428fa36c2d"}, // damage effect
					{label: "99 XX + 10K LF vs 1 L shield - 1.3333 - shield hold", ID: "2157098e-a8ca-5332-80cc-47ededa76e3f"}, // damage effect
					{label: "100 XX + 10K LF vs 1 L shield - 1.3333 - win", ID: "48b1c310-83bc-5488-9fa0-f713b9addb85"}, // damage effect
					{label: "100 XX + / vs 1 L shield - 1.3333 - low hull damage", ID: "c03ad598-75e3-594a-8a2e-47769e911c97"}, // damage effect
					{label: "101 XX + / vs 1 L shield - 1.3333 - low hull damage", ID: "8868729a-fd2b-5af0-8f57-645892b43d1c"}, // damage effect
					{label: "102 XX + / vs 1 L shield - 1.3333 - low hull damage", ID: "afdc21a7-6064-52b0-9406-a28b084091de"}, // damage effect
					{label: "100 XX + 599 LF vs 1 L shield - 1.3333 - win", ID: "1c038dfb-d664-591a-bd81-753071106dc5"}, // damage effect
					{label: "50 SC + 10K recs vs 1 HL - 1.6667 - shield hold", ID: "0aa21a3c-7b27-5c6f-b90a-5c57dc0d1dbb"}, // percentage rounding
					{label: "60 SC + 10K recs vs 1 HL - 1.6667 - shield hold", ID: "b9c01c4a-6db3-5aac-a5ba-a0767921cba3"}, // percentage rounding
					{label: "80 SC + 10K recs vs 1 HL - 1.6667 - shield hold", ID: "81129ae2-8657-5b51-ab73-1b6e89cf1d77"}, // percentage rounding
					{label: "99 SC + 10K recs vs 1 HL - 1.6667 - shield hold", ID: "73253990-652a-55fb-8dfd-d1d4703ea9e1"}, // percentage rounding
					{label: "100 SC + 10K recs vs 1 HL - 1.6667 - win", ID: "d2722c66-3934-5657-8ac5-a2ca686d96cf"}, // percentage rounding
					{label: "99 XX + 10K LF vs 1 L shield - 1.7333 - shield hold", ID: "866837d9-52da-5031-b24a-840ab32f8cc5"}, // percentage rounding
					{label: "100 XX + 10K LF vs 1 L shield - 1.7333 - win", ID: "2110bab9-547a-559b-a446-2f70e02130b8"}, // percentage rounding
					{label: "99 XX + 10K LF vs 1 L shield - 1.8667 - shield hold", ID: "a0e77e7f-5cb7-5abb-befe-673f085c2455"}, // percentage rounding
					{label: "100 XX + 10K LF vs 1 L shield - 1.8667 - win", ID: "7ef6e652-a03f-5629-b1a7-d20bf7c49fdb"}, // percentage rounding
					{label: "49 XX + 10K LF vs 1 L shield - 2 - shield hold", ID: "ba5870ae-3721-58d7-9e1c-96ea56d8a018"}, // percentage rounding
					{label: "50 XX + 10K LF vs 1 L shield - 2 - shield hold", ID: "6f2d38fb-d1f9-54a7-96de-5c505a56b54a"}, // percentage rounding
					{label: "51 XX + 10K LF vs 1 L shield - 2 - win", ID: "b12ad263-935a-5b5f-acdf-3d9ee3ca8a1f"}, // percentage rounding
					{label: "50 XX + / vs 1 L shield - 2 - no hull damage", ID: "f85fff69-fe1c-5576-b5df-50da7f2b6fc8"}, // percentage rounding
					{label: "50 XX + 10K LF vs 1 L shield - 2 - shield hold", ID: "22085da5-de27-50dd-a205-5149f2942965"}, // percentage rounding
					{label: "51 XX + / vs 1 L shield - 2 - low hull damage", ID: "b4c450cd-b3b3-5bdd-9450-f0c3113c304c"}, // percentage rounding
					{label: "49 XX + 10K LF vs 1 L shield - 2.6667 - shield hold", ID: "6abbc081-4ae8-5d90-afd1-c920e8331fda"}, // shield percentage fail
					{label: "50 XX + 10K LF vs 1 L shield - 2.6667 - win", ID: "b31ac9a6-7c30-587c-ac99-963069865ae4"}, // shield percentage fail
					{label: "51 XX + 10K LF vs 1 L shield - 2.6667 - win", ID: "70fcb59a-0566-58f5-84f6-dc000872852a"}, // shield percentage fail
					{label: "1 PF + 10K recs vs 1 HL - 100 - win", ID: "03d0a997-a832-5acc-9267-318d7ebb7cc3"}, // shield percentage fail
					{label: "50 SC + 10K recs vs 1 HL - 2.3333 - win", ID: "a1be1ad3-5c6c-595b-8541-f11086a14f9b"}, // shield percentage fail
					{label: "49 SC + 10K recs vs 1 HL - 2.3333 - shield hold", ID: "45c5bdc9-6d14-5548-89d6-6cef75cddbb0"}, // shield percentage fail
					{label: "33 SC + 10K recs vs 1 HL - 2.6667 - shield hold", ID: "2f85a187-9166-5f72-93fe-bc12d04f168d"}, // shield percentage fail
					{label: "34 SC + 10K recs vs 1 HL - 2.6667 - shield hold", ID: "80833fbd-bee3-5ee7-ad9b-8c80a90728e1"}, // shield percentage fail
					{label: "34 SC + 10K recs vs 1 HL - 2.6667 - shield hold", ID: "91129035-a580-5471-81e6-b539814edd91"}, // shield percentage fail
					{label: "33 SC + 10K recs vs 1 HL - 3 - shield hold", ID: "93391458-91ac-512a-a8cb-0f9e7d9b9cec"}, // shield percentage fail
					{label: "34 SC + 10K recs vs 1 HL - 3 - win", ID: "82504918-00ce-5f33-bc52-eff9c4d3856e"}, // shield percentage fail
					{label: "10K SC + / vs 1 Plasma - 0.7778 - bounce", ID: "b0626f52-2401-5e1a-af2c-b006c6042520"}, // bounce effect
					{label: "10K SC + / vs 1 Plasma - 0.8889 - bounce", ID: "7f81edcc-61f0-57e6-9ca5-31bf56b422db"}, // bounce effect
					{label: "10K SC + / vs 1 Plasma - 1 - bounce", ID: "28d282c5-ecb1-5a38-81e8-f67adf81f86f"}, // bounce effect
					{label: "99 SC + / vs 1 Plasma - 1.1111 - shield hold", ID: "38b61584-a33d-5339-adb1-957c9da827c1"}, // bounce effect
					{label: "100 SC + / vs 1 Plasma - 1.1111 - no hull damage", ID: "41ebf455-7603-5d6f-8492-de61dd029f12"}, // bounce effect
					{label: "99 SC + 10K recs vs 1 Plasma - 1.1111 - shield hold", ID: "93e2d983-ee70-5c16-bc73-039b32374820"}, // bounce effect
					{label: "100 SC + 10K recs vs 1 Plasma - 1.1111 - win", ID: "ef5d28ad-c99c-56d3-bdef-61305c0268fb"}, // bounce effect
					{label: "10K HF + / vs 1 L shield - 1 - shield hold", ID: "f7b46029-3552-5eb6-9d9c-bc4da3df045e"}, // bounce effect
					{label: "10K XX + / vs 1 L shield - 1.3333 - win", ID: "0e3493e2-6d93-5733-906c-79e484c41a42"}, // bounce effect
					{label: "99 XX + 10K LF vs 1 L shield - 1.3333 - shield hold", ID: "bc94fec8-70b3-528f-8808-8e1da1b4a282"}, // shield percentage fail
					{label: "100 XX + 10K LF vs 1 L shield - 1.3333 - win", ID: "e84b0510-d070-591f-9d81-af745390ac5d"}, // shield percentage fail
					{label: "33 PF + 10K SC vs 1 S shield - 3.3333 - shield hold", ID: "9d20a9dc-b298-50dc-874d-3e24c12bcc84"}, // shield percentage fail
					{label: "34 PF + 10K SC vs 1 S shield - 3.3333 - win", ID: "493ad103-14e1-5b09-829a-5e809b55afbf"}, // shield percentage fail
					{label: "33 PF + 10K SC vs 1 S shield - 3.6667 - shield hold", ID: "5e95b01a-ff17-5d25-8a71-7d7a1f194237"}, // shield percentage fail
					{label: "34 PF + 10K SC vs 1 S shield - 3.6667 - win", ID: "5cb955b8-5f03-50f4-bbf5-b9a8b7c84c32"}, // shield percentage fail
					{label: "24 PF + 10K SC vs 1 S shield - 4 - shield hold", ID: "4a9dc3e7-8cc7-53d0-92bc-cf47d8dbc6b4"}, // shield percentage fail
					{label: "25 PF + 10K SC vs 1 S shield - 4 - shield hold", ID: "9d07ee9d-ba5f-5481-adc7-88c2f806969b"}, // shield percentage fail
					{label: "26 PF + 10K SC vs 1 S shield - 4 - win", ID: "068d33be-c35b-539b-a5ad-c7cd99bc9414"}, // shield percentage fail
					{label: "24 BB + 10K LF vs 1 L shield - 4 - shield hold", ID: "6ce5383c-526c-5d5b-82a3-0120ab209292"}, // shield percentage fail
					{label: "25 BB + 10K LF vs 1 L shield - 4 - shield hold", ID: "68f84f7c-d08d-506d-9faf-5d902b2c81d9"}, // shield percentage fail
					{label: "26 BB + 10K LF vs 1 L shield - 4 - win", ID: "ea24e259-40d4-5013-8ea2-bd36d1525aa3"}, // shield percentage fail
					{label: "12 Dessie + 10K LF vs 1 L shield - 8 - shield hold", ID: "78ae760b-07a1-5015-b85d-bf8019139f7f"}, // shield percentage fail
					{label: "13 Dessie + 10K LF vs 1 L shield - 8 - win", ID: "e02872af-ebc5-5fb5-ad7d-bf8008bd9463"}, // shield percentage fail
					{label: "19 BS + 10K LF vs 1 L shield - 5 - shield hold", ID: "a8be0cd4-ea98-5e13-9386-042a78edbadd"}, // shield percentage fail
					{label: "20 BS + 10K LF vs 1 L shield - 5 - shield hold", ID: "0d8b2287-0884-58fa-ba23-c19aeb6f0c5f"}, // shield percentage fail
					{label: "21 BS + 10K LF vs 1 L shield - 5 - win", ID: "1fbe765f-4dca-57ab-8d08-d99dacfdb36f"}, // shield percentage fail
					{label: "9 Dessie + 10K LF vs 1 L shield - 10 - shield hold", ID: "bb81182b-7145-5e64-846a-4a047194bd8c"}, // shield percentage fail
					{label: "10 Dessie + 10K LF vs 1 L shield - 10 - shield hold", ID: "a1a04aa0-c2bc-5f86-9359-516755f8ef1a"}, // shield percentage fail
					{label: "11 Dessie + 10K LF vs 1 L shield - 10 - win", ID: "c1c142c2-029d-5f8a-9014-b49f34de9268"}, // shield percentage fail
					{label: "49 Dessie + 5K XX vs 1 RIP - 2 - shield hold", ID: "bd137e6e-d6aa-5d51-b0ce-c1f0cb389444"}, // shield percentage fail
					{label: "50 Dessie + 5K XX vs 1 RIP - 2 - shield hold", ID: "2d1499c2-d3d8-5696-b66f-e5283b4b29ca"}, // shield percentage fail
					{label: "51 Dessie + 5K XX vs 1 RIP - 2 - win", ID: "e4bf09d7-30e8-56fb-959d-b99ba3d434fd"}, // shield percentage fail
					{label: "99 BS + 5K XX vs 1 RIP - 1.0667 - shield hold", ID: "fcc72101-ff41-52b9-ac19-4577cadfc84f"}, // shield percentage fail
					{label: "100 BS + 5K XX vs 1 RIP - 1.0667 - win", ID: "8b9dcb41-7189-5a48-84a2-7fc54d4fbc52"}, // shield percentage fail
					{label: "49 Dessie + 5K XX vs 1 RIP - 2.1333 - shield hold", ID: "400c0d05-c02c-524d-ad3e-52bfad9365bc"}, // shield percentage fail
					{label: "50 Dessie + 5K XX vs 1 RIP - 2.1333 - win", ID: "cc7ca278-433c-5fbc-9388-83ce156cef35"}, // shield percentage fail
					{label: "49 SC + 10K recs vs 1 PF - 2.6667 - shield hold", ID: "64bf5cf7-f996-525a-be6b-0d1e82d3b18a"}, // shield percentage fail
					{label: "50 SC + 10K recs vs 1 PF - 2.6667 - win", ID: "83040c24-20fb-5b62-bae5-1b848181a85f"}, // shield percentage fail
					{label: "99 SC + 20K recs vs 1 BS - 1.3333 - shield hold", ID: "6614ad6f-0807-5989-b964-ac7ddc460dbc"}, // shield percentage fail
					{label: "100 SC + 20K recs vs 1 BS - 1.3333 - win", ID: "3c98cf5c-7c8e-54a4-86f5-46fe5af6f316"}, // shield percentage fail
					{label: "10K SC + 10K recs vs 1 BS - 0.8333 - bounce", ID: "2b7f7c49-7f3a-51b3-95a8-0ca32de20029"}, // decimal rounding
					{label: "99 SC + 20K recs vs 1 BS - 1 - bounce", ID: "a47040ba-c88f-5a9a-9c32-490a84d076a4"}, // decimal rounding
					{label: "100 SC + 20K recs vs 1 BS - 1 - bounce", ID: "dac78e86-3c07-5bc8-b8c2-833108ec3bb7"}, // decimal rounding
					{label: "101 SC + 20K recs vs 1 BS - 1 - bounce", ID: "3fb99836-407d-5ce7-a5ee-78e7d1717613"}, // decimal rounding
					{label: "99 SC + 20K recs vs 1 BS - 1 - bounce", ID: "3e480f89-0a43-5607-9caa-2a07c02aa434"}, // decimal rounding
					{label: "100 SC + 20K recs vs 1 BS - 1 - bounce", ID: "693f8fba-a820-5ec6-950e-9374545dd2fb"}, // decimal rounding
					{label: "101 SC + 20K recs vs 1 BS - 1 - bounce", ID: "53742c99-3cde-592a-8072-389a9452fb34"}, // decimal rounding
					{label: "10K SC + / vs 1 BS - 1 - bounce", ID: "7530edf3-cf1a-51a6-991a-1079bc7f79f8"}, // decimal rounding
					{label: "99 SC + 20K recs vs 1 BS - 1.1667 - shield hold", ID: "441b7700-4e92-5932-a5e5-8cef7a002a37"}, // decimal rounding
					{label: "100 SC + 20K recs vs 1 BS - 1.1667 - win", ID: "83b8f6ce-5fd9-5b08-bae2-df9e65f90882"}, // decimal rounding
					{label: "99 SC + 20K recs vs 1 PF - 1.6667 - shield hold", ID: "a0fa03a2-07b2-5237-bd6b-99c230a40ca9"}, // decimal rounding
					{label: "100 SC + 20K recs vs 1 PF - 1.6667 - win", ID: "57413173-1143-5488-980f-e6696d96e70e"}, // decimal rounding
					{label: "49 SC + 20K recs vs 1 PF - 2 - shield hold", ID: "d1595fc8-e24d-5484-b2b4-4bcbdd244269"}, // decimal rounding
					{label: "50 SC + 20K recs vs 1 PF - 2 - shield hold", ID: "ae557ff1-8215-50ff-8b6c-9bcd592d8871"}, // decimal rounding
					{label: "51 SC + 20K recs vs 1 PF - 2 - win", ID: "6b536b6a-991b-561a-b7ed-bd0a81a9f9f5"}, // decimal rounding
					{label: "49 SC + 20K recs vs 1 PF - 2 - shield hold", ID: "ff593a2b-728a-5704-ba22-5b68940f9010"}, // decimal rounding
					{label: "50 SC + 20K recs vs 1 PF - 2 - shield hold", ID: "3cedee36-4904-5282-9641-1fc2ba6d5420"}, // decimal rounding
					{label: "51 SC + 20K recs vs 1 PF - 2 - win", ID: "d34b8386-42bb-5fe9-b290-2c5021a5bf90"}, // decimal rounding
					{label: "49 SC + 20K recs vs 1 PF - 2.3333 - shield hold", ID: "2ba33822-13d4-5856-b130-ce835fec7baf"}, // decimal rounding
					{label: "50 SC + 20K recs vs 1 PF - 2.3333 - win", ID: "0a0a5bcb-d874-5bfd-b5f5-48b3f3695e84"}, // decimal rounding
				],
				defaultReportsEnabled: true,
				extraReports: [
					{label: "Random TEST", ID: "70be02ad-fec7-5b4c-b8b1-8fffbf2baeed"},
					{label: "Version 2 ACS", ID: "2ea31118-69ac-5450-a351-ac7ae4860f0e"},
					{label: "Polish ACS", ID: "049379e9-ee2b-58c7-9c7a-ed237ece70a8"},
					{label: "Brazilian bash", ID: "698f1210-57e1-5431-bc0a-6ba53af9302e"},
					{label: "Polish Cargo slap", ID: "e18088ad-e58e-5bd4-8f5c-5cdd181aa6a7"},
					{label: "French Reapers", ID: "391358fa-4edd-59ea-a288-bf77e56b9772"},
					{label: "50K Reapers", ID: "f5fb5f9f-78af-5626-af53-c5141b62f22e"},
					{label: "BS & BC to 1B", ID: "568aa8ed-9d90-518f-8f71-cd9bffdc37c4"},
					{label: "123 RIP kill", ID: "ea686e48-01f8-566f-ab9f-2262f3a7ec6d"},
					{label: "25 RIP kill", ID: "c2065808-50fd-5d76-8ce2-6bc36ea3a2e4"},
					{label: "French ACS", ID: "b9b9bb61-7ede-5ae0-b480-2d24dd3796cd"},
					{label: "186 RIP kill", ID: "ffb0a56f-5dce-5cde-8a49-083dc10bcae3"},
					{label: "Small french raid", ID: "a1440bc9-d042-5282-bce6-0b1eeef5d032"},
					{label: "French NINJA", ID: "34e12a56-cefe-59b1-b259-47b3aa32e1db"},
					{label: "Dutch NINJA", ID: "46bf51ce-1154-5888-b53d-b421110829f9"},
					{label: "Tiny bash", ID: "9350105a-f8fe-53b4-aed8-764a1767ef67"},
					{label: "Tiny million", ID: "2691c854-3c89-52b6-9e7e-3a0573b3e2bc"},
					{label: "Tiny crash", ID: "0d389cc5-3b2a-578a-8baa-5888f9f30bd2"},
					{label: "0 RIP losses", ID: "a9476366-f10f-5ac4-9029-86f1187192a4"},
					{label: "Colo ninja draw", ID: "912bdb5f-333f-5067-b32e-cc3e4e80bdb0"},
					{label: "RL bash", ID: "1b068e29-367b-5d4b-9921-878e8f6c738a"},
					{label: "2K reaper draw", ID: "8a70b919-7e6d-5b84-a3da-9c3a0b4800b3"},
					{label: "3B ACS draw", ID: "3b849795-21a7-5eb4-a3ef-2b18d073c35d"},
					{label: "3B solo draw", ID: "adaf7879-921a-5b0a-8e8f-b93c38c46a82"},
					{label: "Failed ACS draw", ID: "42daa1dc-0bf8-5230-a867-27ae0442705b"},
					{label: "Aliens draw", ID: "74f2c8f4-5727-571f-9c19-83e2c91c67cf"}
				],
				currentRunGroup: 0,
				running: false
			};
		},
		computed:
		{
			testGroups ()
			{
				const groups = {};

				if (this.defaultReportsEnabled) {
					groups.default = {reports: this.defaultReports};
				}

				if (this.extraReports.length > 0) {
					groups.extra = {reports: this.extraReports};
				}

				return groups;
			}
		},
		created()
		{
			this.addValidations(c.validations.tests);
			this.addSubmitAction(this.runTests);
		},
		methods:
		{
			runTests()
			{
				if (this.running === false && this.$refs.simulationGroups.length > 0) {
					for (const simulationGroup of this.$refs.simulationGroups) {
						simulationGroup.reset();
					}

					this.$refs.simulationGroups[this.currentRunGroup].start();

					this.running = true;
				}
			},

			runGroupDone ()
			{
				this.currentRunGroup++;

				if (this.currentRunGroup < this.$refs.simulationGroups.length) {
					this.$refs.simulationGroups[this.currentRunGroup].start();
				} else {
					this.reset();
				}
			},

			runGroupFail ()
			{
				this.reset();

				alert("run group fail");
			},

			reset ()
			{
				this.resetForm();
				this.running = false;
				this.currentRunGroup = 0;
			}
		}
	});