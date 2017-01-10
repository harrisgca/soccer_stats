(function() {
  'use strict';

  const buttonPressedContainer = $('.buttonPressed');
  const actionRecordedContainer = $('.actionRecorded');

  /**
    - Goals
    - Shots
    - Shots on target
    - Corner kicks
    - Free Kicks
    - Offsides
    - Pass completion percentage
  **/
  const teamKeycodes = {
    // our team actions
    97:{button:'a', action: 'Shot off target - Us'},
    115:{button:'s', action: 'Shot on Target - Us'},
    100:{button:'d', action: 'Incomplete Pass - Us'},
    102:{button:'f', action: 'Completed Pass - Us'},
    103:{button:'g', action: 'Goal Scored - Us'},
    // other team actions
    104:{button:'h', action: 'Goal Scored - Them'},
    59:{button:';', action: 'Shot off target - Them'},
    108:{button:'l', action: 'Shot on Target - Them'},
    107:{button:'k', action: 'Incomplete Pass - Them'},
    106:{button:'j', action: 'Completed Pass - them'},
  };

  const displayLastButtonPressed = function _displayLastButtonPressed(e){
    console.log('keypress logged');
    console.log(e.which);
    console.log(teamKeycodes[e.which]);
    if (teamKeycodes[e.which]) {
      buttonPressedContainer.html(`${teamKeycodes[e.which].button}`);
      actionRecordedContainer.html(`${teamKeycodes[e.which].action}`);
      return false;
    }else{
      buttonPressedContainer.html('');
      actionRecordedContainer.html('');
      return false;
    }

  };

  $(window).on('keypress', displayLastButtonPressed);
}());
