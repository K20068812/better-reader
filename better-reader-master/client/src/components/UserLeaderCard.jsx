import React from "react";

const UserLeaderCard = (props) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4 flex items-center">
      {/* Card position */}
      <div className="flex-shrink-0 text-2xl font-bold text-gray-600 mr-4">
        {props?.position}
      </div>
      {/* Card avatar */}
      <img
        src={props?.avatar}
        alt="Card avatar"
        className="rounded-full w-16 h-16 mr-4"
      />
      {/* Card info */}

      <div className="w-full">
        <p className="font-bold">{props?.data?.username}</p>
        <div className="flex justify-between items-center">
          <div className="flex flex-col flex-1">
            <div className="w-full mt-1">
              <div className="h-2 bg-gray-300 rounded-full">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{
                    width: `${props.mapRange(
                      parseInt(props?.data?.points % 250),
                      0,
                      250,
                      0,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Level: {props.getLevel(props?.data?.points)}
            </p>
          </div>
        </div>
      </div>
      <p className="text-sm font-bold ml-5 text-gray-600">
        {props?.data?.points}
      </p>
    </div>
  );
};

export default UserLeaderCard;
