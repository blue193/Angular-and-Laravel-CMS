<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use JWTAuth;
use JWTAuthException;
use App\FireBaseToken;
use Carbon\Carbon;

class SendNotificationController extends Controller
{
	
    public function __construct()
    {
        $this->middleware('jwt.auth');
        //$this->middleware('jwt.auth', ['except' => ['sendFCMMessage','registerFirebaseTokenIDs']]);
    }

    public function sendFCMMessage(Request $request)
    {

        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if ($user)
        // if (true)
        {
			
			$body['server_key'] = 'AAAAQEUnQMU:APA91bEUIwq6vi_48FO26Qyl0UmiVONRvj3KiiCkCTRINNovLktxXBPWd9xRUY9ObTkoQI3_H9_FhX2ph7AouubjyGR-e-AWNJJSt-xwKrWF-z0Mht5uJZVqnTcuk15W7wmLDB5aG2JL';
			$body['text'] = 'here is a message. message';
			$body['title'] = 'This is title #1';
			$body['sound'] = "default";
			$body['color'] = "#203E78";
			$body['expires'] = '2'; 

			$fcmMsg = array(
				'body' => $body['text'],
				'title' => $body['title'],
				'sound' => $body['sound'],
		        'color' => $body['color'] 
			);

			$registrationIDs = $this->refreshSavedToken($body['server_key'],$body['expires']);
			// 'to' => $singleID ;  // expecting a single ID
			// 'registration_ids' => $registrationIDs ;  // expects an array of ids
			// 'priority' => 'high' ; // options are normal and high, if not set, defaults to high.
			$response['registrationIDs'] = $registrationIDs;
			$fcmFields = array(
				// 'to' => $singleID,
		        'priority' => 'high',
		        'registration_ids' => $registrationIDs,
				'notification' => $fcmMsg
			);

			$headers = array(
				'Authorization: key=' . $body['server_key'],
				'Content-Type: application/json'
			);
			 
			$ch = curl_init();
			curl_setopt( $ch,CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send' );
			curl_setopt( $ch,CURLOPT_POST, true );
			curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
			curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
			curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
			curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fcmFields ) );
			$result = curl_exec($ch );
			curl_close( $ch );

            $response['data'] = $result;
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }

    public function registerFirebaseTokenIDs(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if ($user)
    	// if (true)
        {
        	$body['server_key'] = 'AAAAQEUnQMU:APA91bEUIwq6vi_48FO26Qyl0UmiVONRvj3KiiCkCTRINNovLktxXBPWd9xRUY9ObTkoQI3_H9_FhX2ph7AouubjyGR-e-AWNJJSt-xwKrWF-z0Mht5uJZVqnTcuk15W7wmLDB5aG2JL'; 

            $tokeId = $body['token'];
            $serverKey = $body['server_key'];
            $data = FireBaseToken::where('server_key', $serverKey)->where('token', $tokeId)->get();
            // add new element when does not exist
            $buffer['token'] = $body['token'];
            $buffer['server_key'] = $body['server_key'];
            if ($data->count() == 0) {
                $settingData = FireBaseToken::create($buffer);
            } else {
              $settingData = FireBaseToken::where('server_key', $serverKey)
              						->where('token', $tokeId)
              						->update($buffer);   
            }
        } else
        {
            $settingData['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($settingData);
	}

	public function refreshSavedToken($server_key,$expires) {
		$current_time = Carbon::now();
		$backward_time = $current_time->subHour($expires);
		$backward_time = $backward_time->toDateTimeString();
        $tokenListSorted = FireBaseToken::where('server_key', $server_key)
        							->where('updated_at', "<" , $backward_time)
        							->delete(); 
        $tokenList =   FireBaseToken::where('server_key', $server_key)->get();
        return $tokenList->toArray();
	}
	
}