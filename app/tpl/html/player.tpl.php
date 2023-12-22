<?php  
	use Plinth\Response\Response;
	use Plinth\Common\Info;
	/* @var $self Response */
	$route = $self->Main()->getRouter()->getRoute();
	
	$party = $route->get('party');
	$index = $route->get('index');
   	$ships = array(202,203,204,205,206,207,208,209,210,211,212,213,214,215);
   	
   	$partyLabel = $party == 1 ? 'defenders' : 'attackers';
   	$inputBase = 'simulate-' . $partyLabel . '-' . $index;
?>
<li id="<?= substr($partyLabel, 0, -1) . '-' . $index; ?>" class="party-player">
	<div class="remove-player btn-close" data-party="<?= $party; ?>" data-index="<?= $index; ?>">x</div>
	<div class="party-api-wrapper">
		<label class="clearfix">API: <input type="text" pattern="sr-[a-z]{2}-\d{1,3}-\w{40}" data-party="<?= $party; ?>" data-index="<?= $index; ?>" class="input-sr-key" /></label>
		<div class="party-api-load btn btn-light"><?= $__('home.player.api.load'); ?></div>
	</div>
	<div class="clearfix">
		<div class="player-techs">
			<h4><?= $__('home.player.techs.combat'); ?></h4>
			<ul class="simulate-values">
				<li class="clearfix"><label><?= $__('home.player.techs.weapon'); ?> <input type="number" min="0" id="<?= $inputBase; ?>-techs-weapon" data-type="109" value="0" /></label></li>
				<li class="clearfix"><label><?= $__('home.player.techs.shield'); ?> <input type="number" min="0" id="<?= $inputBase; ?>-techs-shield" data-type="110" value="0" /></label></li>
				<li class="clearfix"><label><?= $__('home.player.techs.armour'); ?> <input type="number" min="0" id="<?= $inputBase; ?>-techs-armour" data-type="111" value="0" /></label></li> 
			</ul>
		</div>
		<div class="player-techs">
			<h4><?= $__('home.player.techs.drives'); ?></h4>
			<ul class="simulate-values">
				<li class="clearfix"><label><?= $__('home.player.techs.combustion'); ?> <input type="number" min="0" id="<?= $inputBase; ?>-techs-combustion" data-type="115" value="0" /></label></li>
				<li class="clearfix"><label><?= $__('home.player.techs.impulse'); ?> <input type="number" min="0" id="<?= $inputBase; ?>-techs-impulse" data-type="117" value="0" /></label></li>
				<li class="clearfix"><label><?= $__('home.player.techs.hyperspace'); ?> <input type="number" min="0" id="<?= $inputBase; ?>-techs-hyperspace" data-type="118" value="0" /></label></li> 
			</ul>
		</div>
	</div>
	<h4><?= $__('home.player.ships'); ?></h4>
	<ul class="simulate-values">
		<?php foreach ($ships as $type) { ?>
		<li class="clearfix"><label><?= $__('type.'.$type); ?> <input id="<?= $inputBase; ?>-entity-<?= $type; ?>" min="0" type="number" data-type="<?= $type; ?>" data-lost="0" data-remaining="0" class="entity-number" <?= ($type == 212?'disabled="disabled"':''); ?> /><span id="<?= $inputBase; ?>-entity-<?= $type; ?>-lost" class="entity-remaining"></span></label></li>
		<?php } ?>
	</ul>
	<div class="player-coordinates">
		<h4 class="clearfix"><?= $__('home.player.coords'); ?> 
			<div>
				<input type="number" min="1" id="<?= $inputBase; ?>-coords-galaxy" /> : 
				<input type="number" min="1" id="<?= $inputBase; ?>-coords-system" /> : 
				<input type="number" min="1" id="<?= $inputBase; ?>-coords-position" />
			</div>
		</h4>
		<h4 class="clearfix"><?= $__('home.player.speed'); ?> <div>
			<select id="<?= $inputBase; ?>-fleet-speed">
			<?php for($i=100; $i>0; $i-=10) { ?>
				<option value="<?= $i ?>"><?= $i ?>%</option>
			<?php } ?>
			</select>
		</div></h4>
		<div class="clearfix player-flight-data">
			<?= $__('home.player.flighttime'); ?> <span id="<?= $inputBase; ?>-flighttime" data-hours="<?= $__('home.player.flighttime.hours'); ?>">-</span>
		</div>
		<div class="clearfix player-flight-data">
			<?= $__('home.player.consumption'); ?> <span id="<?= $inputBase; ?>-consumption">-</span>
		</div>
	</div>
	<div class="clear-player btn btn-light" data-base="<?= $inputBase ?>"><?= $__('home.player.clear'); ?></div>
</li>