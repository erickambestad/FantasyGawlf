import React from 'react';
import { Link } from 'react-router'

class Rules extends React.Component {

  render() {
    return (
      <div className="jumbotron">
        <div className="container">
          <h1>Rules & Payouts</h1>
          <Link to={'/'}>Back Home</Link>
          <div className="col-md-12">
            <h2>Rules</h2>
            <ul>
              <li>Select one golfer each week....each golfer can only be used once during the season and cannot be re-used if they miss the cut the first time you chose them</li>
              <li>Dollars earned by your player each week is our points system--if they miss the cut, you earn $0 that week.  So bigger purse tournaments are more important than smaller ones</li>
              <li>The 2016 PGA Tour is split in to quarters and the winner from each quarter will face off in the final Championship. (Final 4 events)</li>
              <li>Top players in each quarter will win prize money with the championship being the biggest pot</li>
              <li>Picks are made on the website or emailed to <a href="mailto:erickambestad@yahoo.com">erickambestad@yahoo.com</a>. If you are unable to login that week. Picks are <strong>DUE BY MIDNIGHT THE NIGHT PRIOR TO THE TOURNAMENT START</strong> (most often midnight Wednesday night....a few tournaments start on Wednesday and in those cases, your pick is due Tuesday midnight)</li>
              <li><strong>Entry fee is due by March 1</strong> and if you haven't paid by then, your picks will not be accepted further until you pay.. please don't do that though.  Confrontation makes me uncomfortable.
                <div style={{marginTop: '20px'}}>
                  Payments can be made through one of the 4 options:
                  <ol style={{marginTop: '10px'}}>
                    <li>Paypal at: <a href="https://www.paypal.me/erickambestad">https://www.paypal.me/erickambestad</a> (Please add $3.20 for the credit card fee for a total of $103.20)</li>
                    <li>Bank transfer (Bank of America) using either erickambestad@yahoo.com or (805) 674-5536</li>
                    <li>Send a check to:<br />
                      <strong>
                        Eric Kambestad<br />
                        24134 Hollyoak Apt. #B<br />
                        Aliso Viejo, Ca<br />
                        92656
                      </strong>
                    </li>
                    <li>Hand me cash or check</li>
                  </ol>
                </div>
              </li>
            </ul>
            <ul>
              <li>If you pick a player that withdraws before the tournament starts, you may re-use him in another week.</li>
              <li>If you pick a player that withdraws after he has teed off, you may not re-use him in another week.</li>
              <li>You can change your pick, but only up to midnight the day before the tournament starts.  Your final pick is what will be used.</li>
              <li>In the event of a tie, we will split the money</li>
              <li>All money will be sent back to players at the conclusion of the season.</li>
            </ul>


            <h2>Payouts</h2>
            <h4>Base on a $1400 total pot (14 entries)</h4>
            <ul>
              <li>Each Quarter Payout: <br />
              1st:  $150, 2nd: $75, 3rd: $25  (Total Quarterly Payout: $250)</li>
              <li>The winners of each quarter get to advance to the 4 Fed Ex Cup finals<br />
              (If someone wins more than one quarter, he will get to have 2 teams in the finals)</li>
              <li>Finals: $350 first (0 for 2nd as each of the 4 players in the finals already won money when they got there)</li>
              <li>$50 for the consolation bracket of all the guys who don’t make the fedex cup finals</li>
              <li>If you win the FedEx finals you will have won a minimum of $500. </li>
            </ul>

          </div>
        </div>
      </div>
    );
  }
}

export default Rules;
