$(function(){
 $('.tlt').textillate({
        // the default selector to use when detecting multiple texts to animate
        selector: '.texts',
      
        // enable looping
        loop: true,
      
        // sets the minimum display time for each text before it is replaced
        minDisplayTime: 1000,
      
        // sets the initial delay before starting the animation
        // (note that depending on the in effect you may need to manually apply
        // visibility: hidden to the element before running this plugin)
        initialDelay: 0.5,
      
        // set whether or not to automatically start animating
        autoStart: true,
      
        // custom set of 'in' effects. This effects whether or not the
        // character is shown/hidden before or after an animation
        inEffects: ['bounceIn'],
      
        // custom set of 'out' effects
        outEffects: [ 'bounceOut' ],
      
        // in animation settings
        in: {
            // set the effect name
          effect: 'bounceIn',
      
          // set the delay factor applied to each consecutive character
          delayScale: 1.5,
      
          // set the delay between each character
          delay: 350,
      
          // set to true to animate all the characters at the same time
          sync: false,
      
          // randomize the character sequence
          // (note that shuffle doesn't make sense with sync = true)
          shuffle: true,
      
          // reverse the character sequence
          // (note that reverse doesn't make sense with sync = true)
          reverse: false,
      
          // callback that executes once the animation has finished
          callback: function () {}
        },
      
        // out animation settings.
        out: {
          effect: 'bounceOut',
          delayScale: .5,
          delay: 10,
          sync: false,
          shuffle: true,
          reverse: false,
          callback: function () {}
        },
      
        // callback that executes once textillate has finished
        callback: function () {},
      
        // set the type of token to animate (available types: 'char' and 'word')
        type: 'char'
      })  });
