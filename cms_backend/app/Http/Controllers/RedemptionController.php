<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use JWTAuth;
use JWTAuthException;
use App\Redemption;
use DB;

class RedemptionController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth');
    }

    public function addRedemption(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if ($user)
        {
            $redemptionData = Redemption::create($body);
        }
        else
        {
            $redemptionData['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($redemptionData);
    }

    public function fetchAllRedemptions(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $appId = $body['app_id'];
        if ($user)
        {
            $response['data'] = DB::table('redemption')
            ->join('members', 'members.id', '=', 'redemption.member_id')
            ->join('staff', 'staff.id', '=', 'redemption.staff_id')
            ->join('bonus', 'bonus.id', '=', 'redemption.bonus_id')
            ->where('redemption.app_id', '=', $appId)
            ->select('members.first_name as member_first_name', 
                'members.last_name as member_last_name', 
                'members.email as member_email', 
                'staff.id as staff_id',
                'staff.first_name as staff_first_name', 
                'staff.last_name as staff_last_name', 
                'bonus.name as bonus_name', 
                'redemption.*')
            ->get();
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }

    public function fetchRedemptionsByCondition(Request $request) {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $appId = $body['app_id'];
        
        if ($user)
        {
            $query = DB::table('redemption')
            ->join('members', 'members.id', '=', 'redemption.member_id')
            ->join('staff', 'staff.id', '=', 'redemption.staff_id')
            ->join('bonus', 'bonus.id', '=', 'redemption.bonus_id')
            ->where('redemption.app_id', '=', $appId)
            ->select('members.first_name as member_first_name', 
                'members.last_name as member_last_name', 
                'members.email as member_email', 
                'staff.id as staff_id',
                'staff.first_name as staff_first_name', 
                'staff.last_name as staff_last_name', 
                'bonus.name as bonus_name', 
                'redemption.*');
            if (isset($body['staff_id'])) {
                $staff_id = $body['staff_id'];    
                $query->where('redemption.staff_id', '=', $staff_id);
            }
            $response['data'] = $query->get();
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }

    public function fetchRedemptionById(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        
        $editId = $body['id'];

        if($user)
        {
            $response = Redemption::find($editId);
            $response['message'] = trans('appmessages.getRedemptionbyidsuccessfully');
        }
        else {
            $response['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($response);
    }

    public function updateRedemption(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        
        if ($user)
        {
            $editId = $body['id'];
            $RedemptionData = Redemption::find($editId);
            $RedemptionData->update($body);
            $response['data'] = Redemption::where('app_id', $RedemptionData->app_id)->get();
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }

    public function deleteRedemption(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $appId = $body['app_id'];
        $deleteId = $body['id'];

        if ($user)
        {
            Redemption::destroy($deleteId);
            $response['data'] = DB::table('redemption')
                ->join('members', 'members.id', '=', 'redemption.member_id')
                ->join('staff', 'staff.id', '=', 'redemption.staff_id')
                ->join('bonus', 'bonus.id', '=', 'redemption.bonus_id')
                ->where('redemption.app_id', '=', $appId)
                ->select('members.first_name as member_first_name', 
                    'members.last_name as member_last_name', 
                    'members.email as member_email', 
                    'staff.id as staff_id',
                    'staff.first_name as staff_first_name', 
                    'staff.last_name as staff_last_name', 
                    'bonus.name as bonus_name', 
                    'redemption.*')
                ->get();
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }
}
