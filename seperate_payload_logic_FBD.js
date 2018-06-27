//Payload seperation logic for FBD
var values = [
    // put all properties of Backbone Models
    '"canvas":',
    '"image":',
    '"reference":',
    '"action_point":',
    '"forces":',
    '"moment":',
    '"studentforces":',
    '"studentmoment":',
    '"label":',
    '"height":',
    '"width":',
    '"position":',
    '"gradable":',
    '"score":',
    '"url":',
    '"rotation":',
    '"opacity":',
    '"reference_angle":',
    '"name":',
    '"distractor":',
    '"type":',
    '"label_name":',
    '"font_color":',
    '"font_size":',
    '"force_angle":',
    '"away":',
    '"tolerance":',
    '"direction":',
    '"lines":',
    '"end_point":',
    '"arrowHead":',
    '"color":',
    '"style":',
    '"width":',
    '"texts":',
    '"content":',
    '"angle":',
    '"bold":',
    '"italic":',
    '"underline":',
    '"size":',
    '"color":',
    '"font":',
    '"comment":',
    '"ignore_direction":',
    '"ignore_angle":'
   ];
function _pack(str){   //_pack code
for(var i=0; i<values.length; i++){
    str = str.replace(RegExp(values[i],'g'), '"_'+i+'":');
}
return str;
}
function _unpack(str){    //_unpack code
    str = str.replace(/"_a?(\d+)":/g, function(){
    return values[arguments[1]];
    });
    return str;
}

  function dex(cipher) {// encoder
    var JSON = "",
    dataString = decodeURIComponent(cipher),
    //dataString = cipher,
    regLen = dataString.length % 2,
    start,
    end,
    regex;
    if(regLen === 0) {
        regex = new RegExp(".{1,2}");
    }
    else {
        regex = new RegExp(".{1,"+regLen+"}");
    }
    end = dataString.match(regex);
    start = dataString.replace(regex, '');
    dataString = "";
    if(start) {
        dataString =  start.match(/.{1,2}/g).reverse().join('');
    }
    if(end) {
        dataString =  dataString + end[0];
    }
    return dataString;
}

 function enx(str){//decoder
    str = str.match(/.{1,2}/g).reverse().join('').replace(/[^{}\[\]":,]+/g, function(){
        return encodeURIComponent(arguments[0]);
        //return arguments[0];
    });
    return str;
}


function seperateStates() {
    var payload = document.getElementById('state').value;
    if (payload) {
        try {
           // var jsonData = JSON.parse(payload);        
            document.getElementById('qstate').value = seperateQuestion(payload);
            document.getElementById('cstate').value = seperateCorrectAns(payload);
            document.getElementById('rstate').value = seperateResponse(payload);

        } catch (e) {
            return;
        }

    } else {
        return;
    }
}

function getQuestionState() {
    var payload = document.getElementById('state').value;
    if (payload) {
        try {
           // var jsonData = JSON.parse(payload);
            document.getElementById('qstate').value = seperateQuestion(payload);

        } catch (e) {
            return;
        }

    } else {
        return;
    }

}


function getCorrectAnsState() {
    var payload = document.getElementById('state').value;
    if (payload) {
        try {
           // var jsonData = JSON.parse(payload);
            document.getElementById('cstate').value = seperateCorrectAns(payload);

        } catch (e) {
            return;
        }
    } else {
        return;
    }

}

function getResponseState() {
    var payload = document.getElementById('state').value;
    if (payload) {
        try {
            //var jsonData = JSON.parse(payload);
            document.getElementById('rstate').value = seperateResponse(payload);

        } catch (e) {
            return;
        }

    } else {
        return;
    }

}

function mergeStates() {
    try {
        var qstate = document.getElementById('qstate').value;
        var cstate = document.getElementById('cstate').value;
        var rstate = document.getElementById('rstate').value;
        var combinedState = combineStates(qstate, cstate, rstate);
        document.getElementById('mstate').value = combinedState;

    } catch (e) {
        alert("Error while merging states!");
    }

}

function seperateQuestion(data) {
    var qstate = "";
    unpack_data =  _unpack(dex(data));
    var dataAction = JSON.parse(unpack_data);
    try {
        for (var i = 0; i < dataAction.action_point.length; i++) {
            delete dataAction.action_point[i].studentforces;
            delete dataAction.action_point[i].studentmoment;
            delete dataAction.action_point[i].score;
            delete dataAction.action_point[i].gradable;
            delete dataAction.action_point[i].distractor;
            delete dataAction.action_point[i].forces.score;
            delete dataAction.action_point[i].forces.gradable;
            delete dataAction.action_point[i].moment.score;
            // delete dataAction.action_point[i].moment.position;
            delete dataAction.action_point[i].moment.gradable;
            //   Object.keys(dataAction.action_point[i].moment).length ? delete dataAction.action_point[i].moment.label.gradable : '';
            //  Object.keys(dataAction.action_point[i].moment).length ? delete dataAction.action_point[i].moment.label.score : '';
            //].moment.label.position : '';
            for (var j = 0; j < dataAction.action_point[i].forces.length; j++) {
                delete dataAction.action_point[i].forces[j].gradable;
                delete dataAction.action_point[i].forces[j].score;
                delete dataAction.action_point[i].forces[j].position;
                delete dataAction.action_point[i].forces[j].force_angle;
                delete dataAction.action_point[i].forces[j].away;
                delete dataAction.action_point[i].forces[j].tolerance;
                delete dataAction.action_point[i].forces[j].ignore_direction;
                delete dataAction.action_point[i].forces[j].ignore_angle;
                // delete dataAction.action_point[i].forces[j].label.gradable;
                // delete dataAction.action_point[i].forces[j].label.score;
                // delete dataAction.action_point[i].forces[j].label.position;            
                // delete dataAction.action_point[i].forces[j].label.label_BBox;     
                // delete dataAction.action_point[i].forces[j].label.text_sub_sup_BBox;                                                                                                                                                                   
            }
            delete dataAction.distractors;
        }    
        Packed_data = JSON.stringify(dataAction);
        console.log(qstate);
        qstate=  _pack(enx(Packed_data));
        return qstate;
    } catch (e) {
        alert("Error while seperatingquestion states!");
    }


}

function seperateCorrectAns(data) {
    unpack_data =  _unpack(dex(data));
    var dataCorrect = JSON.parse(unpack_data);
    var cstate = "";
    var jsonItem = {};
    json_arr = [];

    try {
        for (var i = 0; i < dataCorrect.action_point.length; i++) {
            force_arr = [];
            item = {};
            item["id"] = dataCorrect.action_point[i].id;
            item["score"] = dataCorrect.action_point[i].score;
            item["gradable"] = dataCorrect.action_point[i].gradable;
            item["distractor"] = dataCorrect.action_point[i].distractor;
            //item ["forces"] = dataCorrect.action_point[i].forces;
            item["position"] = dataCorrect.action_point[i].position;
           // item["score"] = dataCorrect.action_point[i].moment.score;

            for (var j = 0; j < dataCorrect.action_point[i].forces.length; j++) {
                innerItem = {}
                innerItem["id"] = dataCorrect.action_point[i].forces[j].id;
                innerItem["gradable"] = dataCorrect.action_point[i].forces[j].gradable;
                innerItem["score"] = dataCorrect.action_point[i].forces[j].score;
                innerItem["position"] = dataCorrect.action_point[i].forces[j].position;
                innerItem["force_angle"] = dataCorrect.action_point[i].forces[j].force_angle;
                innerItem["away"] = dataCorrect.action_point[i].forces[j].away;
                innerItem["tolerance"] = dataCorrect.action_point[i].forces[j].tolerance;
                innerItem["ignore_direction"] = dataCorrect.action_point[i].forces[j].ignore_direction;
                innerItem["ignore_angle"] = dataCorrect.action_point[i].forces[j].ignore_angle;
                force_arr.push(innerItem);
            }
            item["forces"] = force_arr;
            json_arr.push(item);
        }
                                
        jsonItem["action_point"] = json_arr;
        jsonItem["distractors"]  = dataCorrect.distractors;
                                
     //   cstate = JSON.stringify(jsonItem);

        Packed_data = JSON.stringify(jsonItem);
        console.log(cstate);
        cstate=  _pack(enx(Packed_data));   
        return cstate;
    } catch (e) {
        alert("Error while seperateCorrectAnsstates!");
    }
}

function seperateResponse(data) {
    unpack_data =  _unpack(dex(data));
    var rstate = "";
    var dataAction = JSON.parse(unpack_data);
    var jsonItem = {};
    var action_arr = [];
    try {
        if (dataAction) {

            for (var i = 0; i < dataAction.action_point.length; i++) {
                var jsonInnerItem = {};
                if (dataAction.action_point[i].studentforces) {
                    jsonInnerItem['id'] = dataAction.action_point[i].id;
                    jsonInnerItem['studentforces'] = dataAction.action_point[i].studentforces;
                    if (dataAction.action_point[i].studentmoment) {
                        jsonInnerItem['studentmoment'] = dataAction.action_point[i].studentmoment;
                    }
                }
                action_arr.push(jsonInnerItem);
            }

            jsonItem["action_point"] = action_arr;
            jsonItem["comments"] = dataAction.comments;

         //   rstate = JSON.stringify(jsonItem);

            Packed_data = JSON.stringify(jsonItem);
            console.log(rstate);
            rstate=  _pack(enx(Packed_data));           
            return rstate;
        }
    } catch (e) {
        alert("Error while seperatingquestion states!");
    }

}


function combineStates(qstate, cstate, rstate) {

    var qstate = JSON.parse(_unpack(dex(qstate)));
    var cstate = JSON.parse(_unpack(dex(cstate)));
    var rstate = JSON.parse(_unpack(dex(rstate)));

    try {
        var joinState = {};
        if (qstate) {
            joinState = qstate;
        }
        if (cstate) {
            for (var i = 0; i < joinState.action_point.length; i++) {
                for (var j = 0; j < cstate.action_point.length; j++) {
                   if (joinState.action_point[i].id == cstate.action_point[j].id) {

                        joinState.action_point[i].gradable = cstate.action_point[j].gradable;
                        joinState.action_point[i].score = cstate.action_point[j].score;
                        joinState.action_point[i].distractor = cstate.action_point[j].distractor;

                        for (var k = 0; k < joinState.action_point[i].forces.length; k++) {
                            for (var l = 0; l < cstate.action_point[j].forces.length; l++) {
                                joinState.action_point[i].forces[k].gradable = cstate.action_point[j].forces[l].gradable;
                                joinState.action_point[i].forces[k].score = cstate.action_point[j].forces[l].score;
                                joinState.action_point[i].forces[k].position = cstate.action_point[j].forces[l].position;
                                joinState.action_point[i].forces[k].force_angle = cstate.action_point[j].forces[l].force_angle;
                                if (cstate.action_point[j].forces[l].away)
                                    joinState.action_point[i].forces[k].away = cstate.action_point[j].forces[l].away;
                                if (cstate.action_point[j].forces[l].tolerance)
                                    joinState.action_point[i].forces[k].tolerance = cstate.action_point[j].forces[l].tolerance;
                                // if(cstate.action_point[j].forces[l].ignore_direction)
                                joinState.action_point[i].forces[k].ignore_direction = cstate.action_point[j].forces[l].ignore_direction;
                                // if(cstate.action_point[j].forces[l].ignore_angle)
                                joinState.action_point[i].forces[k].ignore_angle = cstate.action_point[j].forces[l].ignore_angle;
                            }

                        }

                    }
                }
            }
           joinState["distractors"] = cstate.distractors;
        }
        if (rstate) {
            for (var i = 0; i < joinState.action_point.length; i++) {
                for (var j = 0; j < rstate.action_point.length; j++) {
                    if (joinState.action_point[i].id == rstate.action_point[j].id) {
                        joinState.action_point[i].studentforces = rstate.action_point[j].studentforces;
                        joinState.action_point[i].studentmoment = rstate.action_point[j].studentmoment;
                    }

                }
            }
        }
       
        joinedState = _pack(enx(JSON.stringify(joinState)));
        console.log(joinedState);
        return joinedState;
    } catch (e) {
        alert("Error while merging states!");
    }
}
