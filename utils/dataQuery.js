export const queryOverview = `
with
  data_swaps as (
    select
      block_timestamp,
      trader,
      b.project_name as from_token,
      from_amount / pow(10, from_decimal) as from_usd,
      c.project_name as to_token,
      to_amount / pow(10, to_decimal) as to_usd
    from
      osmosis.core.fact_swaps a
      join osmosis.core.dim_tokens b on a.from_currency = b.address
      join osmosis.core.dim_tokens c on a.to_currency = c.address
  ),
  data_arb as (
    select
      a.block_timestamp,
      a.trader,
      a.from_token,
      a.to_token,
      a.from_usd,
      a.to_usd,
      b.block_timestamp as b1,
      b.trader as b2,
      b.from_token as b3,
      b.to_token as b4,
      b.from_usd as b5,
      b.to_usd as b6,
      timestampdiff('hour', a.block_timestamp, b.block_timestamp) as diff,
      b.to_usd - a.from_usd as profit
    from
      data_swaps a
      join data_swaps b on a.trader = b.trader
      and a.block_timestamp < b.block_timestamp
      and a.block_timestamp::date = b.block_timestamp::date
      and a.to_token = b.from_token
      and a.to_usd = b.from_usd
      and a.from_usd < b.to_usd
      and a.from_token in ('USDC.grv', 'USDC', 'DAI')
      and b.to_token in ('USDC.grv', 'USDC', 'DAI')
  )
select
  sum(profit) as total_profit,
  avg(profit) as average_profit,
  count(distinct trader) as unique_trader
from
  data_arb
`

export const queryTopTrader = `
with
  data_swaps as (
    select
      block_timestamp,
      trader,
      b.project_name as from_token,
      from_amount / pow(10, from_decimal) as from_usd,
      c.project_name as to_token,
      to_amount / pow(10, to_decimal) as to_usd
    from
      osmosis.core.fact_swaps a
      join osmosis.core.dim_tokens b on a.from_currency = b.address
      join osmosis.core.dim_tokens c on a.to_currency = c.address
  ),
  data_arb as (
    select
      a.block_timestamp,
      a.trader,
      a.from_token,
      a.to_token,
      a.from_usd,
      a.to_usd,
      b.block_timestamp as b1,
      b.trader as b2,
      b.from_token as b3,
      b.to_token as b4,
      b.from_usd as b5,
      b.to_usd as b6,
      timestampdiff('hour', a.block_timestamp, b.block_timestamp) as diff,
      b.to_usd - a.from_usd as profit
    from
      data_swaps a
      join data_swaps b on a.trader = b.trader
      and a.block_timestamp < b.block_timestamp
      and a.block_timestamp::date = b.block_timestamp::date
      and a.to_token = b.from_token
      and a.to_usd = b.from_usd
      and a.from_usd < b.to_usd
      and a.from_token in ('USDC.grv', 'USDC', 'DAI')
      and b.to_token in ('USDC.grv', 'USDC', 'DAI')
  )
select
  trader,
  count(*) as total_trader,
  sum(profit) as total_profit
from
  data_arb
group by
  1
order by
  3 desc
limit
  10
`

export const queryTopARb = `
with
  data_swaps as (
    select
      block_timestamp,
      trader,
      tx_id,
      b.project_name as from_token,
      from_amount / pow(10, from_decimal) as from_usd,
      c.project_name as to_token,
      to_amount / pow(10, to_decimal) as to_usd
    from
      osmosis.core.fact_swaps a
      join osmosis.core.dim_tokens b on a.from_currency = b.address
      join osmosis.core.dim_tokens c on a.to_currency = c.address
  ),
  data_arb as (
    select
      a.block_timestamp,
      a.trader,
      a.tx_id as tx_1,
      a.from_token,
      a.to_token,
      a.from_usd,
      a.to_usd,
      b.block_timestamp as b1,
      b.trader as b2,
      b.tx_id as tx_2,
      b.from_token as b3,
      b.to_token as b4,
      b.from_usd as b5,
      b.to_usd as b6,
      timestampdiff('hour', a.block_timestamp, b.block_timestamp) as diff,
      b.to_usd - a.from_usd as profit
    from
      data_swaps a
      join data_swaps b on a.trader = b.trader
      and a.block_timestamp < b.block_timestamp
      and a.block_timestamp::date = b.block_timestamp::date
      and a.to_token = b.from_token
      and a.to_usd = b.from_usd
      and a.from_usd < b.to_usd
      and a.from_token in ('USDC.grv', 'USDC', 'DAI')
      and b.to_token in ('USDC.grv', 'USDC', 'DAI')
  )
select
  *
from
  data_arb
order by
  profit desc
limit
  10
`

export const queryTopPath = `
with
  data_swaps as (
    select
      block_timestamp,
      trader,
      tx_id,
      b.project_name as from_token,
      from_amount / pow(10, from_decimal) as from_usd,
      c.project_name as to_token,
      to_amount / pow(10, to_decimal) as to_usd
    from
      osmosis.core.fact_swaps a
      join osmosis.core.dim_tokens b on a.from_currency = b.address
      join osmosis.core.dim_tokens c on a.to_currency = c.address
  ),
  data_arb as (
    select
      a.block_timestamp,
      a.trader,
      a.tx_id as tx_1,
      a.from_token,
      a.to_token,
      a.from_usd,
      a.to_usd,
      b.block_timestamp as b1,
      b.trader as b2,
      b.tx_id as tx_2,
      b.from_token as b3,
      b.to_token as b4,
      b.from_usd as b5,
      b.to_usd as b6,
      timestampdiff('hour', a.block_timestamp, b.block_timestamp) as diff,
      b.to_usd - a.from_usd as profit
    from
      data_swaps a
      join data_swaps b on a.trader = b.trader
      and a.block_timestamp < b.block_timestamp
      and a.block_timestamp::date = b.block_timestamp::date
      and a.to_token = b.from_token
      and a.to_usd = b.from_usd
      and a.from_usd < b.to_usd
      and a.from_token in ('USDC.grv', 'USDC', 'DAI')
      and b.to_token in ('USDC.grv', 'USDC', 'DAI')
  )
select
  concat(
    from_token,
    ' - ',
    to_token,
    ' -> ',
    b3,
    ' - ',
    b4
  ) as path,
  count(*) as total_trade,
  sum(profit) as total_profit
from
  data_arb
group by
  1
order by
  3 desc
limit
  10
`
export const queryUserOverview = (address) => `
with
  data_swaps as (
    select
      block_timestamp,
      trader,
      tx_id,
      b.project_name as from_token,
      from_amount / pow(10, from_decimal) as from_usd,
      c.project_name as to_token,
      to_amount / pow(10, to_decimal) as to_usd
    from
      osmosis.core.fact_swaps a
      join osmosis.core.dim_tokens b on a.from_currency = b.address
      join osmosis.core.dim_tokens c on a.to_currency = c.address
  ),
  data_arb as (
    select
      a.block_timestamp,
      a.trader,
      a.tx_id as tx_1,
      a.from_token,
      a.to_token,
      a.from_usd,
      a.to_usd,
      b.block_timestamp as b1,
      b.trader as b2,
      b.tx_id as tx_2,
      b.from_token as b3,
      b.to_token as b4,
      b.from_usd as b5,
      b.to_usd as b6,
      timestampdiff('hour', a.block_timestamp, b.block_timestamp) as diff,
      b.to_usd - a.from_usd as profit
    from
      data_swaps a
      join data_swaps b on a.trader = b.trader
      and a.block_timestamp < b.block_timestamp
      and a.block_timestamp::date = b.block_timestamp::date
      and a.to_token = b.from_token
      and a.to_usd = b.from_usd
      and a.from_usd < b.to_usd
      and a.from_token in ('USDC.grv', 'USDC', 'DAI')
      and b.to_token in ('USDC.grv', 'USDC', 'DAI')
  )
select
  avg(profit) as average_profit,
  sum(profit) as total_profit,
  sum(from_usd) as trade_volume,
  count(*) as total_trade
from
  data_arb
where
 trader = '${address}'
`

export const queryMonthlyProfit = (address) => `
with
  data_swaps as (
    select
      block_timestamp,
      trader,
      tx_id,
      b.project_name as from_token,
      from_amount / pow(10, from_decimal) as from_usd,
      c.project_name as to_token,
      to_amount / pow(10, to_decimal) as to_usd
    from
      osmosis.core.fact_swaps a
      join osmosis.core.dim_tokens b on a.from_currency = b.address
      join osmosis.core.dim_tokens c on a.to_currency = c.address
  ),
  data_arb as (
    select
      a.block_timestamp,
      a.trader,
      a.tx_id as tx_1,
      a.from_token,
      a.to_token,
      a.from_usd,
      a.to_usd,
      b.block_timestamp as b1,
      b.trader as b2,
      b.tx_id as tx_2,
      b.from_token as b3,
      b.to_token as b4,
      b.from_usd as b5,
      b.to_usd as b6,
      timestampdiff('hour', a.block_timestamp, b.block_timestamp) as diff,
      b.to_usd - a.from_usd as profit
    from
      data_swaps a
      join data_swaps b on a.trader = b.trader
      and a.block_timestamp < b.block_timestamp
      and a.block_timestamp::date = b.block_timestamp::date
      and a.to_token = b.from_token
      and a.to_usd = b.from_usd
      and a.from_usd < b.to_usd
      and a.from_token in ('USDC.grv', 'USDC', 'DAI')
      and b.to_token in ('USDC.grv', 'USDC', 'DAI')
  )
select
  date_trunc('week', block_timestamp::date) as date,
  sum(profit) as total_profit,
  sum(from_usd) as trade_volume
from
  data_arb
where
   trader = '${address}'
group by
  1
`

export const queryTopPathUser = (address) => `
with
  data_swaps as (
    select
      block_timestamp,
      trader,
      tx_id,
      b.project_name as from_token,
      from_amount / pow(10, from_decimal) as from_usd,
      c.project_name as to_token,
      to_amount / pow(10, to_decimal) as to_usd
    from
      osmosis.core.fact_swaps a
      join osmosis.core.dim_tokens b on a.from_currency = b.address
      join osmosis.core.dim_tokens c on a.to_currency = c.address
  ),
  data_arb as (
    select
      a.block_timestamp,
      a.trader,
      a.tx_id as tx_1,
      a.from_token,
      a.to_token,
      a.from_usd,
      a.to_usd,
      b.block_timestamp as b1,
      b.trader as b2,
      b.tx_id as tx_2,
      b.from_token as b3,
      b.to_token as b4,
      b.from_usd as b5,
      b.to_usd as b6,
      timestampdiff('hour', a.block_timestamp, b.block_timestamp) as diff,
      b.to_usd - a.from_usd as profit
    from
      data_swaps a
      join data_swaps b on a.trader = b.trader
      and a.block_timestamp < b.block_timestamp
      and a.block_timestamp::date = b.block_timestamp::date
      and a.to_token = b.from_token
      and a.to_usd = b.from_usd
      and a.from_usd < b.to_usd
      and a.from_token in ('USDC.grv', 'USDC', 'DAI')
      and b.to_token in ('USDC.grv', 'USDC', 'DAI')
  )
select
  concat(
    from_token,
    ' - ',
    to_token,
    ' -> ',
    b3,
    ' - ',
    b4
  ) as path,
  count(*) as total_trade,
  sum(profit) as total_profit
from
  data_arb
where
    trader = '${address}'
group by
  1
order by
  3 desc
limit
  10
`

export const queryTopArbUser = (address) => `
with
  data_swaps as (
    select
      block_timestamp,
      trader,
      tx_id,
      b.project_name as from_token,
      from_amount / pow(10, from_decimal) as from_usd,
      c.project_name as to_token,
      to_amount / pow(10, to_decimal) as to_usd
    from
      osmosis.core.fact_swaps a
      join osmosis.core.dim_tokens b on a.from_currency = b.address
      join osmosis.core.dim_tokens c on a.to_currency = c.address
  ),
  data_arb as (
    select
      a.block_timestamp,
      a.trader,
      a.tx_id as tx_1,
      a.from_token,
      a.to_token,
      a.from_usd,
      a.to_usd,
      b.block_timestamp as b1,
      b.trader as b2,
      b.tx_id as tx_2,
      b.from_token as b3,
      b.to_token as b4,
      b.from_usd as b5,
      b.to_usd as b6,
      timestampdiff('hour', a.block_timestamp, b.block_timestamp) as diff,
      b.to_usd - a.from_usd as profit
    from
      data_swaps a
      join data_swaps b on a.trader = b.trader
      and a.block_timestamp < b.block_timestamp
      and a.block_timestamp::date = b.block_timestamp::date
      and a.to_token = b.from_token
      and a.to_usd = b.from_usd
      and a.from_usd < b.to_usd
      and a.from_token in ('USDC.grv', 'USDC', 'DAI')
      and b.to_token in ('USDC.grv', 'USDC', 'DAI')
  )
select
  *
from
  data_arb
where
    trader = '${address}'
order by
  profit desc
`