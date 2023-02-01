import React from "react";
import Icon from "src/components/design_system/icon";

const Share = props => (
  <Icon
    path="M11.5 5.5H12.5C12.7652 5.5 13.0196 5.60536 13.2071 5.79289C13.3946 5.98043 13.5 6.23478 13.5 6.5V14.5C13.5 14.7652 13.3946 15.0196 13.2071 15.2071C13.0196 15.3946 12.7652 15.5 12.5 15.5H3.5C3.23478 15.5 2.98043 15.3946 2.79289 15.2071C2.60536 15.0196 2.5 14.7652 2.5 14.5V6.5C2.5 6.23478 2.60536 5.98043 2.79289 5.79289C2.98043 5.60536 3.23478 5.5 3.5 5.5H4.5 M8 0.5V7.5 M5.5 3L8 0.5L10.5 3"
    {...props}
  />
);

export default Share;
