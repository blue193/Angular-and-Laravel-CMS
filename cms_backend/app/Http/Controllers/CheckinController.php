<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use JWTAuth;
use JWTAuthException;
use App\Checkin;
use DB;

class CheckinController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth');
    }

    public function addCheckin(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if ($user)
        {
            $checkinData = Checkin::create($body);
        }
        else
        {
            $checkinData['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($checkinData);
    }

    public function fetchAllCheckins(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $appId = $body['app_id'];
        if ($user)
        {
            $response['data'] = DB::table('checkin')
            ->join('members', 'members.id', '=', 'checkin.member_id')
            ->join('staff', 'staff.id', '=', 'checkin.staff_id')
            ->where('checkin.app_id', '=', $appId)
            ->select('members.first_name as member_first_name', 
                'members.last_name as member_last_name', 
                'members.email as member_email', 
                'staff.id as staff_id',
                'staff.first_name as staff_first_name', 
                'staff.last_name as staff_last_name',  
                'checkin.*')
            ->get();
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }

    public function fetchCheckinsByCondition(Request $request) {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $appId = $body['app_id'];
        
        if ($user)
        {
            $query = DB::table('checkin')
            ->join('members', 'members.id', '=', 'checkin.member_id')
            ->join('staff', 'staff.id', '=', 'checkin.staff_id')
            ->where('checkin.app_id', '=', $appId)
            ->select('members.first_name as member_first_name', 
                'members.last_name as member_last_name', 
                'members.email as member_email', 
                'staff.id as staff_id',
                'staff.first_name as staff_first_name', 
                'staff.last_name as staff_last_name', 
                'checkin.*');
            if (isset($body['staff_id'])) {
                $staff_id = $body['staff_id'];    
                $query->where('checkin.staff_id', '=', $staff_id);
            }
            $response['data'] = $query->get();
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }

    public function fetchCheckinById(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        
        $editId = $body['id'];

        if($user)
        {
            $response = Checkin::find($editId);
            $response['message'] = trans('appmessages.getCheckinbyidsuccessfully');
        }
        else {
            $response['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($response);
    }

    public function updateCheckin(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        
        if ($user)
        {
            $editId = $body['id'];
            $CheckinData = Checkin::find($editId);
            $CheckinData->update($body);
            $response['data'] = Checkin::where('app_id', $CheckinData->app_id)->get();
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }

    public function deleteCheckin(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $appId = $body['app_id'];
        $deleteId = $body['id'];

        if ($user)
        {
            Checkin::destroy($deleteId);
            $response['data'] = DB::table('checkin')
                ->join('members', 'members.id', '=', 'checkin.member_id')
                ->join('staff', 'staff.id', '=', 'checkin.staff_id')
                ->where('checkin.app_id', '=', $appId)
                ->select('members.first_name as member_first_name', 
                    'members.last_name as member_last_name', 
                    'members.email as member_email', 
                    'staff.id as staff_id',
                    'staff.first_name as staff_first_name', 
                    'staff.last_name as staff_last_name', 
                    'checkin.*')
                ->get();
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }
}
