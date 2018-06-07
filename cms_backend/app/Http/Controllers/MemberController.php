<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use JWTAuth;
use JWTAuthException;
use App\Member;

class MemberController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth');
    }

    public function addMember(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if ($user)
        {
        	$body['notification'] = ($body['notification'] == "true" ? 1 : 0);
            $MemberData = Member::create($body);
        }
        else
        {
            $MemberData['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($MemberData);
    }

    public function createMember(Request $request)
    {
        $body = $request->all();
        $response['app_id'] = $body['app_id'];
        return response()->json($response);
    }

    public function fetchAllMembers(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $appId = $body['app_id'];
        if ($user)
        {
            $response['data'] = Member::where('app_id', $appId)->get();
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }

    public function fetchMemberById(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        
        $editId = $body['id'];

        if($user)
        {
            $response = Member::find($editId);
            $response['message'] = trans('appmessages.getMemberbyidsuccessfully');
        }
        else {
            $response['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($response);
    }

    public function updateMember(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        
        if ($user)
        {
            $editId = $body['id'];
            $MemberData = Member::find($editId)->update($body);
        }
        else
        {
            $MemberData['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($MemberData);
    }

    public function deleteMember(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $appId = $body['app_id'];
        $deleteId = $body['id'];

        if ($user)
        {
            Member::destroy($deleteId);
            $response['data'] = Member::where('app_id', $appId)->get();
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }
}
