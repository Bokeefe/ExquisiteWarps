  (function(){

function pop () {
        $('#corpsename').html("Demo");
        $('#instructions').html("do Different things");
        $('#corpsecount').html("3");
        $('#corpsenum').html("5");
        $('#global').html("number");
}
    $.get("/username", function(data, status){
      if (status === "success"){
        $('#corpseuser').html(data);
      } else {
        $('#corpseuser').html("this is broken");
      }
    });


    // $.get("/corpsekeeper", function(data, status){
    //   if (status === "success"){
    //     $('#corpsename').html("Demo");
    //     $('#instructions').html("do Different things");
    //     $('#corpsecount').html("3");
    //     $('#corpsenum').html("5");
    //     $('#global').html("number");
    //     console.log(data);
    //   } else {
    //     $('#instructions').html("this is broken");
    //   }
    // });

    var corpseKeeper;
    var isFinished;
    $.get(
      "./corpseKeeper.json",
      function( res ) {
        $( ".result" ).html(res);
        corpseKeeper = res;
        $('#corpsename').html(corpseKeeper.name);
        $('#instructions').html(corpseKeeper.instructions);
        $('#corpsecount').html(corpseKeeper.corpseNum);
        $('#corpsenum').html(corpseKeeper.corpseSet);
        $('#global').html(corpseKeeper.timeStamp);
        if(corpseKeeper.corpseNum >= corpseKeeper.corpseSet){
          isFinished = true;
    }

        $.get(
          "./tracks.json",
          function( res ) {
            $( ".result" ).html( res );
            var tracks = res;
            for(var i in res){
              if(i > 4) {
                tracks = res;
              } else {
                tracks = [res[i]];
              }
        }

    function punch(){
      var trackData = playlistEditor.getInfo();
      var trackData2 = playlistEditor.getInfo();
      $.get(
        "./corpseKeeper.json",
        function( res ) {
        var corpseKeeper = res;
        var timeSub = corpseKeeper.timeStamp;
        var update =  {
            "name":corpseKeeper.name,
            "instructions":corpseKeeper.instructions,
            "corpseNum":corpseKeeper.corpseNum += 1,
            "corpseSet":corpseKeeper.corpseSet,
            "timeStamp":corpseKeeper.timeStamp,
            "globalLoss":corpseKeeper.globalLoss += corpseKeeper.timeStamp};
      update = JSON.stringify(update);
      $.post("/timeStamp",
        {update:update},
        function(data,status){
        console.log(status);
      });
      function subTime(timeSub){
        for(var i in trackData){
          trackData2[i.length].start=trackData[i.length].start-timeSub;
          trackData2[i.length].end=trackData[i.length].end-timeSub;
          }  
      }
      //subTime(timeSub);

      $.get(
        "./tracks.json",
        function( res ) {
        allTracks = res;
        var newTrack;
        for(var i in trackData2){
          newTrack =  trackData2[i];
        }
        allTracks.push(newTrack);
        var addOne = JSON.stringify(allTracks);
        console.log(addOne);
        
      $.post("/punch",
        {addOne:addOne},
          function(data,status){
            //location.reload();
          });
        });
      });   
    }
    $('#saveOrder').click(punch);


    function deleteTrack(){
      var trackDel = [];
      var trackNow = playlistEditor.getInfo();
      for(var i =0; i < trackNow.length-1;i++) {
        trackDel.push(trackNow[i]);
      }
      console.log(playlistEditor.getJson());
      trackDel = JSON.stringify(trackDel);

      $.post("/delete",
        {trackDel:trackDel},
        function(data,status){
            location.reload();
      });
    }
    $('#delete').click(deleteTrack);

          var tracksLength = 0;
          function scaleRes(arr){
            for(var i in arr){
                tracksLength = parseInt(arr[i].end)*1.1;
            }
          }
          scaleRes(tracks);
          
          var config = new WaveformPlaylist.Config({
              resolution: tracksLength * 60,
              mono: true,
              waveHeight: 100,
              container: document.getElementById("playlist"),
              timescale: true,
              controls: {
                  show: true, //whether or not to include the track controls
                  width: 100, //width of controls in pixels
                  height:200 
              },
              UITheme: "bootstrap",
              state: 'select',
              waveOutlineColor: 'white'

          });  


          playlistEditor = Object.create(WaveformPlaylist, { //making this a global variable is cheating
            config: {
              value: config
            }
          });
          playlistEditor.init(tracks);
        },
        'json');
         });
    })();