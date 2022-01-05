export interface ODataQuery {
  $filter?: string;
  $expand?: string;
  $orderby?: string;
  $top?: number;
  $skip?: number;
}
