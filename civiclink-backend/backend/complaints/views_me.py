from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        is_officer = hasattr(user, 'officer_profile')
        is_citizen = hasattr(user, 'citizen_profile')
        payload = {
            'username': user.username,
            'is_officer': is_officer,
            'is_citizen': is_citizen,
        }
        if is_officer:
            op = user.officer_profile
            payload['officer'] = {'gn_division': op.gn_division}
        if is_citizen:
            cp = user.citizen_profile
            payload['citizen'] = {
                'nic': cp.nic,
                'full_name': cp.full_name,
                'address': cp.address,
                'gn_division': cp.gn_division,
            }
        return Response(payload)
