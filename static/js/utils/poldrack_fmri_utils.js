/* ************************************ */
/* Setup fMRI trigger listener and functions */
/* ************************************ */
var trigger_times = []

document.onkeypress = function(evt) {
	evt = evt || window.event;
	var charCode = evt.keyCode || evt.which; 
	var which_key = String.fromCharCode(charCode);
	if (which_key == 't') {
		time = jsPsych.totalTime().toString();
		trigger_times.push(time)
	} else {
		time = jsPsych.totalTime().toString();
		console.log(which_key, time)
	}
}

var clear_triggers = function() {
	trigger_times = []
}

function addID(exp_id) {
	jsPsych.data.addDataToLastTrial({
		exp_id: exp_id,
		trigger_times: trigger_times
	})
	clear_triggers()
}


/* ************************************ */
/* default jsPsych fMRI blocks */
/* ************************************ */

var fmri_scanner_wait_block = {
	type: 'poldrack-text',
	text: "<div class = centerbox><div style = 'font-size: 50px', class = center-text>Test run will start after scanner calibration</p></div>",
	cont_key: [32],
	data: {
		trial_id: "fmri_scanner_wait"
	},
	timing_response: -1,
	timing_post_trial: 0
};

// blank block to put after the last ignored trigger as a buffer before experiment
var fmri_buffer_block = {
	type: 'poldrack-single-stim',
	stimulus: '',
	is_html: true,
	choices: 'none',
	timing_stim: 1000, 
	timing_response: 1000,
	data: {
		trial_id: "fmri_buffer"
	},
	timing_post_trial: 0
};

// block to wait for triggers
var create_trigger_block = function(trigger) {
	var fMRI_wait_block = {
		type: 'poldrack-text',
		text: "<div class = centerbox><div  class = center-text>Scanner calibration<br><strong>Please don't move!</strong></p></div>",
		cont_key: [trigger],
		data: {
			trial_id: "fmri_trigger_wait"
		},
		timing_response: -1,
		timing_post_trial: 0
	};
	return fMRI_wait_block
}

// test response keys
var create_key_test_block = function(choice, keycode_lookup = {}) {
	if (Object.keys(keycode_lookup).length == 0) {
		keycode_lookup = {'B': 'thumb', 'Y': 'index finger', 'G': 'middle finger', 
						'R': 'ring finger', 'M': 'pinky', '1': 'thumb', '2': 'index finger', 
						'3': 'middle finger', '4': 'ring finger', '5': 'pinky'}
	}
	var finger = keycode_lookup[String.fromCharCode(choice)]
	var instruct_text = "Please press your " + finger
	if (finger == null) {
		instruct_text = "Wait for instructions from the experimenter."
	}
	var key_test_block = {
		type: 'poldrack-text',
		text: "<div class = centerbox><div style = 'font-size: 50px' class = center-text>" + instruct_text + "</p></div>",
		cont_key: [choice],
		data: {
			trial_id: "fmri_response_test"
		},
		timing_response: -1,
		timing_post_trial: 500
	};
	return key_test_block
}

// setup function
var setup_fmri_intro = function(lst, choices = [], num_ignore = 16, trigger = 84) {
	for (var i=0; i < choices.length; i++) {
		lst.push(create_key_test_block(choices[i]))
	}
	lst.push(fmri_scanner_wait_block)
	for (var j = 0; j < num_ignore; j++) {
		lst.push(create_trigger_block(trigger))
	}
	lst.push(fmri_buffer_block)
}

// setup function
var setup_fmri_run = function(lst, num_ignore = 16, trigger = 84) {
	for (var j = 0; j < num_ignore; j++) {
		lst.push(create_trigger_block(trigger))
	}
	lst.push(fmri_buffer_block)
}