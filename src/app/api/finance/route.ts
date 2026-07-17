import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  
  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    // Fetch historical and current data from Yahoo Finance API
    // Using interval=15m and range=1d for intraday sparklines
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=15m&range=1d`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Accept': 'application/json'
        },
        next: { revalidate: 60 } // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error(`Yahoo Finance API returned status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.chart.result || data.chart.result.length === 0) {
      throw new Error('No data found for symbol');
    }

    const result = data.chart.result[0];
    const meta = result.meta;
    const timestamps = result.timestamp || [];
    const closePrices = result.indicators.quote[0].close || [];
    
    // Format sparkline data for recharts
    const sparkline = [];
    for (let i = 0; i < timestamps.length; i++) {
      if (closePrices[i] !== null) {
        sparkline.push({
          time: timestamps[i],
          price: closePrices[i]
        });
      }
    }

    const currentPrice = meta.regularMarketPrice;
    const previousClose = meta.previousClose;
    const volume = meta.regularMarketVolume || 0;
    const change24h = ((currentPrice - previousClose) / previousClose) * 100;

    return NextResponse.json({
      symbol: meta.symbol,
      currentPrice,
      previousClose,
      change24h,
      volume,
      sparkline
    });

  } catch (error: any) {
    console.error('Finance API Proxy Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch financial data' },
      { status: 500 }
    );
  }
}
