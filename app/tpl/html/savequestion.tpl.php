<div id="save-wrapper">
	<div id="save-question">
		<h3><?= $__('home.save.question.title'); ?></h3>
		<div>
			<label><input type="checkbox" value="0" /> <?= $__('home.save.question.attackers'); ?></label>
			<label><input type="checkbox" value="1" /> <?= $__('home.save.question.defenders'); ?></label>
			<label><input type="checkbox" value="settings" /> <?= $__('home.save.question.settings'); ?></label>
		</div>
		<div id="save-data-btn" class="btn btn-light" data-name="{name}"><?= $__('home.save.question.save'); ?></div>
	</div>
</div>