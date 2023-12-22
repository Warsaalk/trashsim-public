<?php 
use Plinth\Response\Response;
use Plinth\Common\Language;
/* @var $self Response */

$self->addData('pageTitle', ' - ' . $__('userprojects.title'));
?> 
	<div id="userprojects">
	    <h2><?= $__('userprojects.title'); ?></h2>
	    <p><?= $__('userprojects.intro'); ?></p>
	    <div class="userprojects-block">
	    	<h3><?= $__('userprojects.api.title'); ?></h3>
	    	<div class="userprojects-item">
				<p><?= $__('userprojects.api.info'); ?>:</p>
				<ul>
					<li>https://trashsim.universeview.be/?SR_KEY={KEY}</li>
					<li>https://trashsim.universeview.be/{LANG}?SR_KEY={KEY}</li>
				</ul>
				<h4><?= $__('userprojects.params'); ?>:</h4>
				<p>
					{KEY} <?= $__('userprojects.api.param.key'); ?><br/>
					{LANG} <?= $__('userprojects.lang.param'); ?> (<a onclick="window.location.hash='userprojects-languages';"><?= $__('userprojects.lang.supported'); ?></a>)
				</p>
				<h4><?= $__('userprojects.example'); ?>:</h4>
				<p>
					https://trashsim.universeview.be/en?SR_KEY=sr-en-680-fc3b242fb73e700f3da54748844d90506a0cd705
				</p>
	    	</div>
	    	<h3><?= $__('userprojects.prefill.title'); ?></h3>
	    	<div class="userprojects-item">
	    		<p>
	    			<?= $__('userprojects.prefill.info'); ?>:
	    			<ul>
	    				<li>https://trashsim.universeview.be/#prefill={BASE64JSON}</li>
	    				<li>https://trashsim.universeview.be/{LANG}#prefill={BASE64JSON}</li>
	    			</ul>
	    		</p>
				<h4><?= $__('userprojects.params'); ?>:</h4>
				<p>
					{BASE64JSON} <?= $__('userprojects.prefill.param.json'); ?><br/>
					{LANG} <?= $__('userprojects.lang.param'); ?> (<a onclick="window.location.hash='userprojects-languages';"><?= $__('userprojects.lang.supported'); ?></a>)
				</p>
				<h4><?= $__('userprojects.prefill.json.title'); ?>:</h4>
				<p>
					<?= $__('userprojects.prefill.json.p1'); ?>:
					<ul>
						<li>0 -> <?= $__('userprojects.prefill.json.properties.i1'); ?></li>
						<li>1 -> <?= $__('userprojects.prefill.json.properties.i2'); ?></li>
						<li>settings -> <?= $__('userprojects.prefill.json.properties.i3'); ?></li>
					</ul>
				</p>
				<p>
					<?= $__('userprojects.prefill.json.p2'); ?>
				</p>
				<p>
					<?= $__('userprojects.prefill.json.p3'); ?>
				</p>
				<table class="userprojects-json-table">
					<thead>
						<tr><th><?= $__('userprojects.prefill.table.h.main'); ?></th><th><?= $__('userprojects.prefill.table.h.sub'); ?></th><th><?= $__('userprojects.prefill.table.h.value'); ?></th><th><?= $__('userprojects.example'); ?></th></tr>
					</thead>
					<tbody>
                        <tr><td>class *</td><td></td><td>0 ... 3</td><td>0</td></tr>
						<tr><td rowspan="3">resources</td><td>metal</td><td>integer</td><td>100</td></tr>
						<tr><td>crystal</td><td>integer</td><td>50</td></tr>
						<tr><td>deuterium</td><td>integer</td><td>10</td></tr>
						<tr><td rowspan="3">research</td><td>106</td><td>{"level": integer}</td><td>{"level": 10}</td></tr>
						<tr><td colspan="3">...</td></tr>
						<tr><td>199</td><td>{"level": integer}</td><td>{"level": 4}</td></tr>
						<tr><td rowspan="3">ships</td><td>202</td><td>{"count": integer}</td><td>{"count": 1347}</td></tr>
						<tr><td colspan="3">...</td></tr>
						<tr><td>219</td><td>{"count": integer}</td><td>{"count": 453}</td></tr>
						<tr><td rowspan="3">defence</td><td>401</td><td>{"count": integer}</td><td>{"count": 2794}</td></tr>
						<tr><td colspan="3">...</td></tr>
						<tr><td>503</td><td>{"count": integer}</td><td>{"count": 20}</td></tr>
						<tr><td rowspan="3">planet</td><td>galaxy</td><td>integer</td><td>3</td></tr>
						<tr><td>system</td><td>integer</td><td>287</td></tr>
						<tr><td>position</td><td>integer</td><td>11</td></tr>
						<tr><td>speed</td><td></td><td>integer</td><td>80</td></tr>
					</tbody>
				</table>
                <p>
					* <?= $__('userprojects.prefill.table.class.notice'); ?>
                </p>
				<p>
					<?= $__('userprojects.prefill.table.notice'); ?>
				</p>
				<p>
					<?= $__('userprojects.prefill.table.settings'); ?>
				</p>
				<table class="userprojects-json-table">
					<thead>
						<tr><th><?= $__('userprojects.prefill.table.h.prop'); ?></th><th><?= $__('userprojects.prefill.table.h.value'); ?></th><th><?= $__('userprojects.example'); ?></th></tr>
					</thead>
					<tbody>
						<tr><td>speed_fleet</td><td>integer</td><td>2</td></tr>
						<tr><td>galaxies</td><td>integer</td><td>7</td></tr>
						<tr><td>systems</td><td>integer</td><td>499</td></tr>
						<tr><td>rapid_fire</td><td>integer</td><td>1</td></tr>
						<tr><td>def_to_tF</td><td>0 or 1</td><td>0</td></tr>
						<tr><td>debris_factor</td><td>0.0 to 1.0</td><td>0.3</td></tr>
						<tr><td>repair_factor</td><td>0.0 to 1.0</td><td>0.7</td></tr>
						<tr><td>donut_galaxy</td><td>0 or 1</td><td>1</td></tr>
						<tr><td>donut_system</td><td>0 or 1</td><td>1</td></tr>
						<tr><td>plunder</td><td>50, 75 or 100</td><td>75</td></tr>
						<tr><td>simulations</td><td>1 to ...</td><td>15</td></tr>
                        <tr><td>characterClassesEnabled</td><td>0 or 1</td><td>1</td></tr>
                        <tr><td>minerBonusFasterTradingShips</td><td>integer (%)</td><td>100</td></tr>
                        <tr><td>minerBonusIncreasedCargoCapacityForTradingShips</td><td>integer (%)</td><td>25</td></tr>
                        <tr><td>warriorBonusFasterCombatShips</td><td>integer (%)</td><td>100</td></tr>
                        <tr><td>warriorBonusFasterRecyclers</td><td>integer (%)</td><td>100</td></tr>
                        <tr><td>warriorBonusRecyclerFuelConsumption</td><td>integer (%)</td><td>25</td></tr>
                        <tr><td>combatDebrisFieldLimit</td><td>integer (%)</td><td>25</td></tr>
					</tbody>
				</table>
	    		<h4><?= $__('userprojects.prefill.json.example'); ?>:</h4>
	    		<p>
	    			{"0":[{"research":{"109":{"level":17},"110":{"level":17},"111":{"level":19},"115":{"level":17},"117":{"level":14},"118":{"level":13}},"ships":{"203":{"count":124},"204":{"count":5342},"206":{"count":1943}},"planet":{"galaxy":1,"system":124,"position":8},"speed":80}],"1":[{"resources":{"metal":5932712,"crystal":3742953,"deuterium":1284233},"research":{"109":{"level":15},"110":{"level":14},"111":{"level":16},"115":{"level":16},"117":{"level":13},"118":{"level":11}},"ships":{"202":{"count":2353},"203":{"count":438}},"defence":{"401":{"count":3842},"402":{"count":1438},"407":{"count":1},"502":{"count":10}},"planet":{"galaxy":2,"system":235,"position":11}}],"settings":{"speed_fleet":"2","galaxies":"7","systems":"499","rapid_fire":"1","def_to_tF":"0","debris_factor":"0.5","donut_galaxy":"1","donut_system":"1","plunder":50,"simulations":15}}
	    		</p>
	    		<h4><?= $__('userprojects.prefill.json.encoded'); ?>:</h4>
	    		<p>
	    			eyIwIjpbeyJyZXNlYXJjaCI6eyIxMDkiOnsibGV2ZWwiOjE3fSwiMTEwIjp7ImxldmVsIjoxN30sIjExMSI6eyJsZXZlbCI6MTl9LCIxMTUiOnsibGV2ZWwiOjE3fSwiMTE3Ijp7ImxldmVsIjoxNH0sIjExOCI6eyJsZXZlbCI6MTN9fSwic2hpcHMiOnsiMjAzIjp7ImNvdW50IjoxMjR9LCIyMDQiOnsiY291bnQiOjUzNDJ9LCIyMDYiOnsiY291bnQiOjE5NDN9fSwicGxhbmV0Ijp7ImdhbGF4eSI6MSwic3lzdGVtIjoxMjQsInBvc2l0aW9uIjo4fSwic3BlZWQiOjgwfV0sIjEiOlt7InJlc291cmNlcyI6eyJtZXRhbCI6NTkzMjcxMiwiY3J5c3RhbCI6Mzc0Mjk1MywiZGV1dGVyaXVtIjoxMjg0MjMzfSwicmVzZWFyY2giOnsiMTA5Ijp7ImxldmVsIjoxNX0sIjExMCI6eyJsZXZlbCI6MTR9LCIxMTEiOnsibGV2ZWwiOjE2fSwiMTE1Ijp7ImxldmVsIjoxNn0sIjExNyI6eyJsZXZlbCI6MTN9LCIxMTgiOnsibGV2ZWwiOjExfX0sInNoaXBzIjp7IjIwMiI6eyJjb3VudCI6MjM1M30sIjIwMyI6eyJjb3VudCI6NDM4fX0sImRlZmVuY2UiOnsiNDAxIjp7ImNvdW50IjozODQyfSwiNDAyIjp7ImNvdW50IjoxNDM4fSwiNDA3Ijp7ImNvdW50IjoxfSwiNTAyIjp7ImNvdW50IjoxMH19LCJwbGFuZXQiOnsiZ2FsYXh5IjoyLCJzeXN0ZW0iOjIzNSwicG9zaXRpb24iOjExfX1dLCJzZXR0aW5ncyI6eyJzcGVlZF9mbGVldCI6IjIiLCJnYWxheGllcyI6IjciLCJzeXN0ZW1zIjoiNDk5IiwicmFwaWRfZmlyZSI6IjEiLCJkZWZfdG9fdEYiOiIwIiwiZGVicmlzX2ZhY3RvciI6IjAuNSIsImRvbnV0X2dhbGF4eSI6IjEiLCJkb251dF9zeXN0ZW0iOiIxIiwicGx1bmRlciI6NTAsInNpbXVsYXRpb25zIjoxNX19
	    		</p>
	    		<h4><?= $__('userprojects.prefill.json.fullexample'); ?>:</h4>
	    		<p>
	    			<?= $__('userprojects.prefill.json.p'); ?>
	    		</p>
				<p>
					https://trashsim.universeview.be/en#prefill=eyIwIjpbeyJzaGlwcyI6eyIyMDMiOnsiY291bnQiOjEyNH19fV0sInNldHRpbmdzIjp7InNwZWVkX2ZsZWV0IjoiMiJ9fQ==
				</p>
				<p>
					<?= $__('userprojects.prefill.json.used'); ?>: {"0":[{"ships":{"203":{"count":124}}}],"settings":{"speed_fleet":"2"}}
				</p>
	    	</div>
			<p>
				<?= $__('userprojects.lang.info'); ?>:
			</p>
			<div id="userprojects-languages">
				<?php 
					$languages = Language::getLanguages();
					foreach ($languages as $langcode) {
				?>
				<span><?= $langcode; ?></span>
				<?php } ?>
			</div>
	    </div>
    </div>