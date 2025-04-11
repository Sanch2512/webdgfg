#include <iostream>
#include <sstream>
#include <vector>

using namespace std;

char findClass(int firstOctet) {
    if (firstOctet >= 1 && firstOctet <= 126)
        return 'A';
    else if (firstOctet >= 128 && firstOctet <= 191)
        return 'B';
    else if (firstOctet >= 192 && firstOctet <= 223)
        return 'C';
    else
        return 'X';
}

vector<int> splitIP(const string& ipAddress) {
    vector<int> octets;
    istringstream iss(ipAddress);
    string octet;
    while (getline(iss, octet, '.')) {
        octets.push_back(stoi(octet));
    }
    return octets;
}

void displayNetworkAndHostID(const vector<int>& octets, char ipClass) {
    string networkID, hostID;
    if (ipClass == 'A') {
        networkID = to_string(octets[0]);
        hostID = to_string(octets[1]) + "." + to_string(octets[2]) + "." + to_string(octets[3]);
    } else if (ipClass == 'B') {
        networkID = to_string(octets[0]) + "." + to_string(octets[1]);
        hostID = to_string(octets[2]) + "." + to_string(octets[3]);
    } else if (ipClass == 'C') {
        networkID = to_string(octets[0]) + "." + to_string(octets[1]) + "." + to_string(octets[2]);
        hostID = to_string(octets[3]);
    } else {
        cout << "Invalid IP address class." << endl;
        return;
    }
    cout << "Network ID: " << networkID << endl;
    cout << "Host ID: " << hostID << endl;
}

int main() {
    string ipAddress;
    cout << "Enter an IPv4 address: ";
    cin >> ipAddress;

    vector<int> octets = splitIP(ipAddress);
    if (octets.size() != 4) {
        cout << "Invalid IP address format." << endl;
        return 1;
    }

    char ipClass = findClass(octets[0]);
    if (ipClass == 'X') {
        cout << "Invalid IP address class." << endl;
        return 1;
    }

    cout << "Given IP address belongs to Class " << ipClass << endl;
    displayNetworkAndHostID(octets, ipClass);

    return 0;
}
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjU0OTk3Y2Q1N2MyZDYyYzYyYTkxNiIsImlhdCI6MTc0NDI2OTE2NCwiZXhwIjoxNzQ0MjcyNzY0fQ.GVpnxQesDMNXptWvaA3lPQsujvR4Ds8UjTjFhizYfmA





//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjdhZjUxMGZhZWYwNmE2M2Y0NjJkOCIsImlhdCI6MTc0NDI4NTU4OCwiZXhwIjoxNzQ0Mjg5MTg4fQ.YyuacWjUuYgK-5MPJHxaqQEiwsOuAHjIxOqo_0V5d7A