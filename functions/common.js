
/**
 * Setup
 */
const debugEl = document.getElementById('debug'),
			// Mapping of indexes to icons: start from banana in middle of initial position and then upwards
			iconMap = ["banana", "seven", "cherry", "plum", "orange", "bell", "bar", "lemon", "melon"],
			// Width of the icons
			icon_width = 79,	
			// Height of one icon in the strip
			icon_height = 79,	
			// Number of icons in the strip
			num_icons = 9,	
			// Max-speed in ms for animating one icon down
			time_per_icon = 100,
			// Holds icon indexes
			indexes = [0, 0, 0];
const announcement = document.querySelector('.announcement');

/** 
 * Roll one reel
 */
const roll = (reel, offset = 0) => {
	// Minimum of 2 + the reel offset rounds
	const delta = (offset + 2) * num_icons + Math.round(Math.random() * num_icons); 
	
	// Return promise so we can wait for all reels to finish
	return new Promise((resolve, reject) => {
		
		const style = getComputedStyle(reel),
					// Current background position
					backgroundPositionY = parseFloat(style["background-position-y"]),
					// Target background position
					targetBackgroundPositionY = backgroundPositionY + delta * icon_height,
					// Normalized background position, for reset
					normTargetBackgroundPositionY = targetBackgroundPositionY%(num_icons * icon_height);
		
		// Delay animation with timeout, for some reason a delay in the animation property causes stutter
		setTimeout(() => { 
			// Set transition properties ==> https://cubic-bezier.com/#.41,-0.01,.63,1.09
			reel.style.transition = `background-position-y ${(8 + 1 * delta) * time_per_icon}ms cubic-bezier(.41,-0.01,.63,1.09)`;
			// Set background position
			reel.style.backgroundPositionY = `${backgroundPositionY + delta * icon_height}px`;
		}, offset * 150);
			
		// After animation
		setTimeout(() => {
			// Reset position, so that it doesn't get higher without limit
			reel.style.transition = `none`;
			reel.style.backgroundPositionY = `${normTargetBackgroundPositionY}px`;
			// Resolve this promise
			resolve(delta%num_icons);
		}, (8 + 1 * delta) * time_per_icon + offset * 150);
		
	});
};


function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  

//   Confetti Effect
function confettiShooter() {
    const element = document.getElementById('e0DQ82qcIov1');
    element.svgatorPlayer.ready(function() {
      // this refers to the player object
      const player = element ? element.svgatorPlayer : {};
      if (player.play) {
        player.play();
      }
  
    });
  
  }

/**
 * Roll all reels, when promise resolves roll again
 */
function rollAll() {
	
	debugEl.textContent = 'rolling...';
	
	const reelsList = document.querySelectorAll('.slots > .reel');
    
	Promise
		
		// Activate each reel, must convert NodeList to Array for this with spread operator
		.all( [...reelsList].map((reel, i) => roll(reel, i)) )

		// When all reels done animating (all promises solve)
		.then((deltas) => {
			// add up indexes
			deltas.forEach((delta, i) => indexes[i] = (indexes[i] + delta)%num_icons);
			debugEl.textContent = indexes.map((i) => iconMap[i]).join(' - ');
			// Win conditions
			if (
					(indexes[0] == indexes[1] && indexes[0] == indexes[2]) ||
					(indexes[1] == indexes[0] && indexes[1] == indexes[2]) ||
					(indexes[2] == indexes[0] && indexes[2] == indexes[1]) 
			) {
					console.log('BIG PRIZE')
					announcement.innerHTML = 'CONGRATULATIONS YOU WON THE BIG PRIZE!!!'
					setTimeout(() => {announcement.remove()}, 3000)
					confettiShooter()
			} else if (
					indexes[0] == indexes[1] || indexes[0] == indexes[2] || indexes[1] == indexes[2]
			) {
					console.log('Consolation')
					announcement.innerHTML = 'CONGRATULATIONS YOU WON THE CONSOLATION PRIZE!!!'
					setTimeout(() => {announcement.remove()}, 2000)
					confettiShooter()
      } else {
				announcement.innerHTML = 'YOU CAN DO IT! TRY AGAIN!!'
				setTimeout(() => {announcement.remove()}, 2000)
      }
		});
        console.log('first')
};

function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

document.querySelector('.spinBtn').addEventListener('click', throttle(rollAll, 5000));